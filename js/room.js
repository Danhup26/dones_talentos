/* =====================================================================
   SALA POR CÓDIGO (celular ↔ pantalla por internet)
   · La pantalla crea un código de 12 caracteres (se muestra con un QR).
   · El nombre del canal y la clave de firma se derivan del código con SHA-256: sin el código
     no se puede encontrar el canal ni firmar mensajes.
   · Cada mensaje va firmado con HMAC-SHA-256; la pantalla solo obedece mensajes válidos.
   · Una vez emparejado, el QR se oculta para que nadie del público lo escanee.
   ===================================================================== */
var Room = (function () {
  var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', LS_CODE = 'ponlo.room', LS_PAIRED = 'ponlo.paired';
  var role = null, code = '', chanId = '', keyP = null, sb = null, ch = null, subscribed = false, linked = false;
  var sending = false, pend = null, getState = null, lastAck = 0, beat = null, pairFns = [];
  var enc = function (s) { return new TextEncoder().encode(s); };

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(''); }
  function b64(buf) { var s = ''; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s); }
  function unb64(t) { var s = atob(t), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function norm(t) { return String(t || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function valid(c) { return c.length === 12 && c.split('').every(function (x) { return ALPHA.indexOf(x) >= 0; }); }
  function gen() { var a = new Uint8Array(12), s = '', i; crypto.getRandomValues(a); for (i = 0; i < 12; i++) s += ALPHA[a[i] & 31]; return s; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  function available() { return !!(window.CLOUD && CLOUD.url && CLOUD.key && window.supabase && window.crypto && crypto.subtle && window.TextEncoder); }

  function derive(c) {
    return crypto.subtle.digest('SHA-256', enc('room:' + c)).then(function (h) {
      chanId = hex(h).slice(0, 32);
      return crypto.subtle.digest('SHA-256', enc('sign:' + c));
    }).then(function (k) {
      return crypto.subtle.importKey('raw', k, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
    }).then(function (k) { keyP = k; });
  }
  function pack(obj) {
    var d = JSON.stringify(obj);
    return crypto.subtle.sign('HMAC', keyP, enc(d)).then(function (m) { return { d: d, m: b64(m) }; });
  }
  function unpack(p) {
    if (!p || typeof p.d !== 'string' || typeof p.m !== 'string') return Promise.resolve(null);
    var sig; try { sig = unb64(p.m); } catch (e) { return Promise.resolve(null); }
    return crypto.subtle.verify('HMAC', keyP, sig, enc(p.d)).then(function (ok) {
      if (!ok) return null;
      try { return JSON.parse(p.d); } catch (e) { return null; }
    }).catch(function () { return null; });
  }
  function send(evt, obj) {
    if (!ch || !subscribed) return Promise.resolve(false);
    return pack(obj).then(function (p) { return ch.send({ type: 'broadcast', event: evt, payload: p }); })
      .then(function (r) { return r === 'ok'; }).catch(function () { return false; });
  }

  function setLinked(v) {
    var changed = linked !== v; linked = v;
    Sync.ext(v ? 'lan' : (subscribed ? 'wait' : 'error'));
    if (v && role === 'screen' && lsGet(LS_PAIRED) !== '1') lsSet(LS_PAIRED, '1');
    if (changed) pairFns.forEach(function (f) { f(v); });
  }
  function cur() { return getState ? getState() : null; }
  function okState(s) { return !!(s && s.cfg && s.cfg.ver === DEFAULT_CONFIG.ver); }

  /* Controlador → pantalla: el último estado gana. */
  function pushState(st) {
    if (role !== 'control') return;
    pend = st;
    if (sending) return;
    sending = true;
    (function loop() {
      var s = pend; pend = null;
      if (!s) { sending = false; return; }
      send('c2s', { t: 'state', s: s, ts: Date.now() }).then(function (ok) {
        if (!ok) { pend = pend || s; sending = false; setTimeout(function () { if (pend && !sending) pushState(pend); }, 1500); return; }
        loop();
      });
    })();
  }

  function onMsg(m) {
    unpack(m && m.payload).then(function (d) {
      if (!d) return;                                     // firma inválida: se ignora
      if (role === 'screen') {
        if ((d.t === 'hello' || d.t === 'state') && okState(d.s)) Sync.external(d.s, 'room');
        if (d.t === 'hello') { setLinked(true); send('s2c', d.hb ? { t: 'ack', ts: Date.now() } : { t: 'ack', s: cur(), ts: Date.now() }); }
      } else {
        if (d.t === 'ack') {
          lastAck = Date.now();
          var first = !linked;
          setLinked(true);
          if (okState(d.s)) Sync.external(d.s, 'room');
          if (first && cur()) pushState(cur());
        }
        if (d.t === 'req' && cur()) pushState(cur());
      }
    });
  }

  function announce() {
    if (role === 'control') send('c2s', { t: 'hello', s: cur(), ts: Date.now() });
    else send('s2c', { t: 'req', ts: Date.now() });
  }
  function startBeat() {
    clearInterval(beat);
    beat = setInterval(function () {
      if (role !== 'control' || !subscribed) return;
      send('c2s', { t: 'hello', hb: 1, ts: Date.now() });
      if (linked && Date.now() - lastAck > 35000) setLinked(false);
    }, 10000);
  }
  function onSub(status) {
    if (status === 'SUBSCRIBED') { subscribed = true; lastAck = Date.now(); setLinked(false); announce(); }
    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') { subscribed = false; setLinked(false); }
  }
  function connect() {
    if (ch && sb) { try { sb.removeChannel(ch); } catch (e) {} }
    subscribed = false; linked = false;
    if (!sb) sb = supabase.createClient(CLOUD.url, CLOUD.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, realtime: { params: { eventsPerSecond: 30 } } });
    ch = sb.channel('r-' + chanId, { config: { broadcast: { self: false, ack: false } } });
    ch.on('broadcast', { event: role === 'screen' ? 'c2s' : 's2c' }, onMsg);
    ch.subscribe(onSub);
    startBeat();
  }

  return {
    available: available,
    parse: function (t) { var c = norm(t); return valid(c) ? c : null; },
    format: function (c) { return String(c || code).replace(/(.{4})(?=.)/g, '$1-'); },
    savedCode: function () { var c = lsGet(LS_CODE); return c && valid(c) ? c : null; },
    saveCode: function (c) { lsSet(LS_CODE, c); },
    ensureCode: function () { var c = Room.savedCode(); if (!c) { c = gen(); lsSet(LS_CODE, c); lsSet(LS_PAIRED, null); } return c; },
    wasPaired: function () { return lsGet(LS_PAIRED) === '1'; },
    code: function () { return code; },
    suffix: function () { return code.slice(-4); },
    url: function () { return location.origin + location.pathname + '#c=' + code; },
    setStateGetter: function (f) { getState = f; },
    onPaired: function (f) { pairFns.push(f); },
    isLinked: function () { return linked; },
    start: function (r, c) { role = r; code = c; return derive(c).then(connect); },
    /* Pantalla: genera otro código (invalida al celular anterior). */
    newCode: function () { var c = gen(); lsSet(LS_CODE, c); lsSet(LS_PAIRED, null); code = c; return derive(c).then(connect); },
    publish: function (st) { if (role === 'control' && ch) pushState(st); }
  };
})();
