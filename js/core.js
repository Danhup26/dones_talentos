/* =====================================================================
   PONLO EN ACCIÓN — NÚCLEO (utilidades, iconos, sonido, sincronización)
   ===================================================================== */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function pad2(n) { return (n < 10 ? '0' : '') + n; }
/* Reloj compartido: con el servidor local, celular y pantalla miden el tiempo con el mismo reloj. */
var TIME_OFFSET = 0;
function nowMs() { return Date.now() + TIME_OFFSET; }
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Iconos (SVG lineal 24×24) ---------- */
var ICONS = {
  mask: '<path d="M3 4c3 1 6 1.5 9 1.5S18 5 21 4v7a9 9 0 0 1-18 0Z"/><path d="M8.5 10h.01M15.5 10h.01"/><path d="M9 15c1.8 1.3 4.2 1.3 6 0"/>',
  palette: '<path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2.2a2 2 0 0 0-1.4 3.4A1.6 1.6 0 0 1 12 22z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="16.5" cy="10.5" r="1.2"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
  camera: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  restart: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  tv: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="m17 2-5 5-5-5"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  sparkle: '<path d="M12 3l1.9 5.8L20 10.5l-6.1 1.4L12 18l-1.9-6.1L4 10.5l6.1-1.7z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  moon: '<circle cx="12" cy="12" r="9" fill="currentColor"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  mute: '<path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/>',
  expand: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  puzzle: '<path d="M19.44 7.85c-.05.32.06.65.29.88l1.57 1.57a2.4 2.4 0 0 1 0 3.4l-1.61 1.62a.98.98 0 0 1-.84.27c-.47-.07-.8-.48-.97-.92a2.5 2.5 0 1 0-3.21 3.21c.44.17.85.5.92.97a.98.98 0 0 1-.27.84l-1.61 1.61a2.4 2.4 0 0 1-3.41 0l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.08-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.47-.18.9-.53.97-1.02a1.03 1.03 0 0 0-.29-.88l-1.57-1.57a2.4 2.4 0 0 1 0-3.4L4.23 8.77c.24-.24.58-.35.92-.3.51.07.88.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.2-.93-.56-1.01-1.07a1.04 1.04 0 0 1 .3-.92l1.53-1.53a2.4 2.4 0 0 1 3.4 0l1.57 1.57c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.47.18-.9.53-.97 1.02Z"/>'
};
function icon(n, cls) {
  return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || '') + '</svg>';
}

/* ---------- Sonido (sintetizado; se puede reemplazar con archivos) ---------- */
var Sound = (function () {
  var ctx = null, master = null, enabled = true, files = {};
  function init() {
    if (ctx) return true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.3;
      var comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
      return true;
    } catch (e) { return false; }
  }
  function tone(f, start, dur, type, vol, glide) {
    var t = ctx.currentTime + start, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .2, t + .03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
  }
  function air(start, dur, vol) {
    var len = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / len);
    var s = ctx.createBufferSource(); s.buffer = b;
    var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = .6;
    var g = ctx.createGain(); g.gain.value = vol || .06; s.connect(f); f.connect(g); g.connect(master); s.start(ctx.currentTime + start);
  }
  var synth = {
    start: function () { tone(220, 0, 1.6, 'sine', .14, 330); [440, 554.37, 659.25].forEach(function (f, i) { tone(f, .3 + i * .12, 1.2, 'sine', .08); }); },
    tick: function () { tone(880, 0, .08, 'triangle', .07); },
    last: function () { tone(660, 0, .18, 'sine', .12); tone(990, .02, .2, 'sine', .06); },
    time: function () { tone(392, 0, .9, 'sine', .16); tone(587.33, .05, 1, 'sine', .12); air(0, .6, .05); },
    complete: function () { [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, i * .08, .9, 'sine', .1); }); },
    piece: function () { tone(1046.5, 0, .5, 'sine', .08); tone(1567.98, .06, .6, 'sine', .05); },
    transition: function () { air(0, 1.1, .07); tone(140, 0, 1.1, 'sine', .07, 90); },
    assemble: function () { tone(110, 0, 4, 'sine', .16, 220); [261.63, 329.63, 392, 523.25, 659.25].forEach(function (f, i) { tone(f, .8 + i * .25, 3, 'sine', .06); }); air(.5, 3, .04); }
  };
  return {
    unlock: function () { if (init() && ctx.state === 'suspended') ctx.resume(); },
    setEnabled: function (v) { enabled = !!v; },
    setFiles: function (f) { files = f || {}; },
    play: function (n) {
      if (!enabled) return;
      if (files[n]) { try { var a = new Audio(files[n]); a.volume = .8; a.play().catch(function () {}); return; } catch (e) {} }
      if (!init()) return; if (ctx.state === 'suspended') ctx.resume();
      try { synth[n] && synth[n](); } catch (e) {}
    }
  };
})();

/* ---------- Estado ---------- */
var STORE_STATE = 'ponlo.state.v1';
var STORE_CFG = 'ponlo.config.v1';

function loadConfig() {
  var c = clone(DEFAULT_CONFIG);
  try { var s = JSON.parse(localStorage.getItem(STORE_CFG) || 'null'); if (s && s.teams && s.ver === DEFAULT_CONFIG.ver) c = mergeCfg(c, s); } catch (e) {}
  return c;
}
function mergeCfg(base, over) {
  var out = clone(base);
  Object.keys(over).forEach(function (k) { out[k] = over[k]; });
  out.teams = (over.teams || base.teams).slice(0, 3);
  while (out.teams.length < 3) out.teams.push(clone(base.teams[out.teams.length]));
  out.rounds = Math.max(2, Math.min(8, +out.rounds || 6));
  out.perMission = out.rounds * pm(out) > 8 ? 1 : pm(out);
  while (out.plan.length < out.rounds) out.plan.push(clone(base.plan[out.plan.length] || newPlanRound(out, out.plan.length)));
  return out;
}
function freshState(cfg) {
  return {
    v: 1, rev: 0, at: nowMs(),
    scene: 'safe', round: 0, seg: 0, key: 0, fx: 0,
    timer: { dur: 30, endsAt: 0, left: 30000, running: false },
    done: {},          // "r-t": true (misión completada = pieza obtenida)
    order: [],         // orden en que se obtuvieron las piezas
    last: null,        // última pieza obtenida
    points: [0, 0, 0],
    paused: false,
    verse: 'main',
    cfg: cfg
  };
}
function challengeById(cfg, id) {
  for (var i = 0; i < cfg.challenges.length; i++) if (cfg.challenges[i].id === id) return cfg.challenges[i];
  return cfg.challenges[0] || { id: 'x', title: 'Reto', disc: 'colectivo', secs: 30, text: '' };
}
function roundInfo(state, r) {
  var cfg = state.cfg, p = cfg.plan[r] || cfg.plan[0];
  var items = [0, 1, 2].map(function (t) { return challengeById(cfg, p.picks[t]); });
  var secs = Math.max.apply(null, items.map(function (c) { return +c.secs || 30; }));
  return { title: p.title, items: items, secs: secs, verse: cfg.verses[p.verse] || null };
}
function challengeNumber(state, r, t) { return r * 3 + t + 1; }
/* Rompecabezas: filas = rondas × piezas por misión (máx. 8 filas = 24 piezas). Una misión (ronda-equipo) entrega 1 o 2 piezas. */
function pm(cfg) { return Math.max(1, Math.min(2, +cfg.perMission || 1)); }
function gridRows(cfg) { return cfg.rounds * pm(cfg); }
function pieceIds(cfg, r, t) { var out = [], k, n = pm(cfg); for (k = 0; k < n; k++) out.push((r * n + k) + '-' + t); return out; }
function totalPieces(state) { return 3 * gridRows(state.cfg); }
function piecesDone(state) { return state.order.length * pm(state.cfg); }
function newPlanRound(cfg, idx) {
  var ch = cfg.challenges, n = ch.length, o = (idx * 3) % n;
  return { title: 'Ronda ' + (idx + 1), picks: [ch[o % n].id, ch[(o + 1) % n].id, ch[(o + 2) % n].id], verse: 'main' };
}
function wheelAfterFor(rounds) { return rounds <= 2 ? [0] : rounds <= 4 ? [1] : rounds <= 6 ? [1, 3] : [2, 5]; }
function timerLeft(timer) {
  if (!timer) return 0;
  if (timer.running) return Math.max(0, timer.endsAt - nowMs());
  return Math.max(0, timer.left);
}

/* ---------- Sincronización ----------
   1) Servidor local (servidor.js): celular y proyector en el mismo WiFi, sin internet. Es lo recomendado.
   2) Nube: base de datos del Artifact de claude.ai (tiempo real entre celular y proyector).
   3) Local: BroadcastChannel + localStorage (dos ventanas en el mismo computador, sin internet).
   Funcionan a la vez; la de mayor "rev" gana. */
var Sync = (function () {
  var bc = null, ref = null, listeners = [], statusFns = [], status = 'local', writing = false, pending = null;
  var detDone = false, detCbs = [];
  function detected() { if (detDone) return; detDone = true; detCbs.splice(0).forEach(function (f) { f(); }); }
  var lan = false, lanInfo = null, lanWriting = false, lanPending = null, pin = '', es = null;
  try { pin = sessionStorage.getItem('ponlo.pin') || ''; } catch (e) {}

  function syncClock() {
    var best = null, n = 0;
    (function one() {
      var t0 = Date.now();
      fetch('/api/time', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
        var t1 = Date.now(), rtt = t1 - t0;
        if (!best || rtt < best.rtt) best = { rtt: rtt, off: j.t + rtt / 2 - t1 };
        TIME_OFFSET = best.off;
        if (++n < 4) setTimeout(one, 150);
      }).catch(function () {});
    })();
  }
  function lanWrite(st) {
    if (!lan) return;
    if (lanWriting) { lanPending = st; return; }
    lanWriting = true;
    fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-pin': pin }, body: JSON.stringify(st) }).then(function (r) {
      if (r.status === 401) { setStatus('pin'); return; }
      if (r.status === 409) return r.json().then(function (cur) { if (cur && cur.cfg) emit(cur, 'server'); });
      if (status === 'pin' || status === 'error') setStatus('lan');
    }).catch(function () { setStatus('error'); }).then(function () {
      lanWriting = false; if (lanPending) { var p = lanPending; lanPending = null; lanWrite(p); }
    });
  }
  function lanStart() {
    fetch('/api/info', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (info) {
      lan = true; lanInfo = info; setStatus('connecting'); syncClock(); setInterval(syncClock, 60000);
      es = new EventSource('/api/events');
      es.onopen = function () { if (status !== 'pin') setStatus('lan'); };
      es.onmessage = function (e) { var s = null; try { s = JSON.parse(e.data); } catch (_) {} emit(s && s.cfg && s.cfg.ver === DEFAULT_CONFIG.ver ? s : null, 'server'); };
      es.onerror = function () { setStatus('error'); };
    }).catch(function () {}).then(detected);
  }
  function setStatus(s) { status = s; statusFns.forEach(function (f) { f(s); }); }
  function emit(st, src) { listeners.forEach(function (f) { f(st, src); }); }
  function parseSnap(snap) {
    try {
      if (!snap || snap.exists === false) return null;
      var d = typeof snap.data === 'function' ? snap.data() : (snap.data !== undefined ? snap.data : snap);
      if (d && typeof d.json === 'string') return JSON.parse(d.json);
    } catch (e) {}
    return null;
  }
  function cloudWrite(st) {
    if (!ref) return;
    if (writing) { pending = st; return; }
    writing = true;
    Promise.resolve(ref.set({ json: JSON.stringify(st), rev: st.rev })).then(function () {
      if (status !== 'cloud') setStatus('cloud');
    }).catch(function () { setStatus('error'); }).then(function () {
      writing = false; if (pending) { var p = pending; pending = null; cloudWrite(p); }
    });
  }
  return {
    init: function () {
      try {
        bc = new BroadcastChannel('ponlo-en-accion');
        bc.onmessage = function (e) {
          if (!e.data) return;
          if (e.data.t === 'state') emit(e.data.s, 'local');
          if (e.data.t === 'hello') emit(null, 'hello');
        };
      } catch (e) {}
      window.addEventListener('storage', function (e) {
        if (e.key === STORE_STATE && e.newValue && !bc) { try { emit(JSON.parse(e.newValue), 'local'); } catch (_) {} }
      });
      setStatus('local');
      if (location.protocol === 'http:' || location.protocol === 'https:') lanStart(); else detected();
      if (window.claude && typeof window.claude.use === 'function') {
        setStatus('connecting');
        window.claude.use('db').then(function (db) {
          if (!db) { setStatus('local'); return; }
          ref = db.doc('live/state');
          ref.onSnapshot(function (snap) { setStatus('cloud'); var s = parseSnap(snap); if (s) emit(s, 'cloud'); },
                         function () { setStatus('error'); });
        }).catch(function () { setStatus('local'); });
      }
    },
    publish: function (st) {
      try { localStorage.setItem(STORE_STATE, JSON.stringify(st)); } catch (e) {}
      try { bc && bc.postMessage({ t: 'state', s: st }); } catch (e) {}
      cloudWrite(st); lanWrite(st);
      if (window.Room) Room.publish(st);
    },
    /* Para la sala por código: entrega estados verificados y cambia el indicador de conexión. */
    external: function (st, src) { emit(st, src); },
    ext: function (s) { setStatus(s); },
    whenDetected: function (f) { if (detDone) return f(); detCbs.push(f); setTimeout(detected, 2500); },
    setPin: function (p) { pin = String(p || '').trim(); try { sessionStorage.setItem('ponlo.pin', pin); } catch (e) {} },
    info: function () { return lanInfo; },
    hello: function () { try { bc && bc.postMessage({ t: 'hello' }); } catch (e) {} },
    cached: function () { try { var j = JSON.parse(localStorage.getItem(STORE_STATE) || 'null'); return j && j.cfg && j.cfg.ver === DEFAULT_CONFIG.ver ? j : null; } catch (e) { return null; } },
    onState: function (f) { listeners.push(f); },
    onStatus: function (f) { statusFns.push(f); f(status); },
    status: function () { return status; },
    hasCloud: function () { return !!ref; }
  };
})();

function logoSrc(which) { return (window.LOGO_SOURCES && LOGO_SOURCES['logo-' + which]) || ''; }
