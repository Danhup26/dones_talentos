/* =====================================================================
   MODO PANTALLA — lo que ve el público. Sin botones ni datos técnicos.
   ===================================================================== */
var Screen = (function () {
  var S = null, wheelRot = 0, root, timers = [], tick = null, isDemo = false, attached = false, lastSec = null, sig = '', ringC = 2 * Math.PI * 46;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearLater() { timers.forEach(clearTimeout); timers = []; }
  function team(t) { return S.cfg.teams[t] || { name: 'Equipo ' + (t + 1), color: '#fff' }; }
  function haveCount(t) { var n = 0; for (var r = 0; r < S.cfg.rounds; r++) if (S.done[r + '-' + t]) n++; return n * pm(S.cfg); }
  function pieceStack(r, t, color, has) {
    var rows = gridRows(S.cfg);
    return pieceIds(S.cfg, r, t).map(function (pid) { var x = Figure.single(rows, pid, color); return has ? x : x.replace('class="solo"', 'class="solo ghost"'); }).join('');
  }
  function logos() {
    return '<div class="logo-pair"><span class="plate"><img src="' + logoSrc('ipuc') + '" alt="IPUC"></span>' +
      '<img class="disc" src="' + logoSrc('artistica') + '" alt="Artística"></div>';
  }

  /* ---------- Firma: decide cuándo se reconstruye la escena ---------- */
  function signature(s) {
    var base = [s.scene, s.key, s.round, s.seg, s.verse].join('|');
    if (s.scene === 'brief' || s.scene === 'timer' || s.scene === 'teams') base += JSON.stringify(roundInfo(s, s.round)) + JSON.stringify(s.cfg.teams);
    return base;
  }

  /* ---------- Entrada de estado ---------- */
  function apply(st) {
    if (!st || !st.cfg) return;
    if (S && st.rev < S.rev && st.at < S.at) return;
    var prev = S; S = st;
    if (!isDemo) { try { localStorage.setItem(STORE_STATE, JSON.stringify(st)); } catch (e) {} }
    Sound.setEnabled(S.cfg.soundOn); Sound.setFiles(S.cfg.sounds);
    document.body.classList.toggle('accessible', !!S.cfg.accessible);

    var ns = signature(S), rebuild = ns !== sig;
    sig = ns;
    if (rebuild) render(prev);
    else if (S.scene === 'complete' || S.scene === 'progress') renderInner(prev);

    if (prev) {
      if (S.order.length > prev.order.length) { Sound.play('complete'); setTimeout(function () { Sound.play('piece'); }, 450); }
      if (S.timer.running && !prev.timer.running) { Sound.play('start'); lastSec = null; }
      if (S.fx !== prev.fx) transition();
      if (S.scene === 'wheel' && prev.scene === 'wheel' && S.wheel && prev.wheel && S.wheel.n !== prev.wheel.n && S.wheel.idx >= 0) spinWheel();
    }
  }

  /* ---------- Render ---------- */
  function render(prev) {
    clearLater();
    var html = '', sc = S.scene;
    if (sc === 'safe') html = vSafe();
    else if (sc === 'intro') html = vIntro();
    else if (sc === 'teams') html = vTeams();
    else if (sc === 'brief') html = vBrief();
    else if (sc === 'timer') html = vTimer();
    else if (sc === 'complete') html = '<div class="scene complete" id="inner">' + vComplete(prev) + '</div>';
    else if (sc === 'progress') html = '<div class="scene progress" id="inner">' + vProgress() + '</div>';
    else if (sc === 'verse') html = vVerse();
    else if (sc === 'wheel') html = vWheel();
    else if (sc === 'pause') html = vPause();
    else if (sc === 'finale') html = vFinale();
    else html = '<div class="scene black"></div>';
    root.innerHTML = html;
    if (sc === 'wheel') initWheel();
    if (sc === 'intro') runIntro();
    if (sc === 'finale') runFinale();
    if (sc === 'intro' || (sc === 'finale' && S.seg === 0)) Sound.play(sc === 'intro' ? 'start' : 'transition');
    if (sc === 'timer') { lastSec = null; updateTimer(true); }
  }
  function renderInner(prev) { var el = $('#inner'); if (!el) return; el.innerHTML = S.scene === 'complete' ? vComplete(prev) : vProgress(); }

  function vSafe() {
    return '<div class="scene safe"><div class="rise">' + logos() + '</div>' +
      '<h1 class="brand rise d2">' + esc(S.cfg.title) + '</h1>' +
      '<p class="subtitle rise d3">' + esc(S.cfg.subtitle) + '</p></div>';
  }

  function vIntro() {
    var parts = S.cfg.subtitle.split('.').map(function (x) { return x.trim(); }).filter(Boolean);
    return '<div class="scene intro">' +
      '<div class="layer" id="i1"><p class="credit-small">Una producción del</p><p class="credit-big">' + esc(S.cfg.credits.line1) + ' — ' + esc(S.cfg.credits.line2) + '</p>' +
        '<p class="credit-small">' + esc(S.cfg.credits.line3) + ' el ' + esc(S.cfg.credits.line4) + '</p></div>' +
      '<div class="layer" id="i2"><p class="opening">' + esc(S.cfg.opening) + '</p></div>' +
      '<div class="layer" id="i3"><h1 class="brand xl">' + esc(S.cfg.title) + '</h1><div class="triad">' +
        parts.map(function (p, i) { return '<span style="transition-delay:' + (1.2 + i * .7) + 's">' + esc(p) + '.</span>'; }).join('') +
      '</div></div></div>';
  }
  function runIntro() {
    var show = function (id) { $$('.intro .layer').forEach(function (l) { l.classList.toggle('on', l.id === id); }); };
    later(function () { show('i1'); }, 300);
    later(function () { show('i2'); }, 4600);
    later(function () { show('i3'); Sound.play('start'); }, 8600);
  }

  function vTeams() {
    var cols = [0, 1, 2].map(function (t) {
      var tm = team(t), ghosts = '';
      for (var r = 0; r < gridRows(S.cfg); r++) ghosts += Figure.single(gridRows(S.cfg), r + '-' + t, tm.color).replace('class="solo"', 'class="solo ghost"');
      return '<div class="tcard rise d' + (t + 2) + '" style="--tc:' + tm.color + '"><span class="tlabel">Equipo ' + (t + 1) + '</span>' +
        '<h2 class="tname">' + esc(tm.name) + '</h2><div class="ghosts">' + ghosts + '</div></div>';
    }).join('');
    return '<div class="scene teams"><p class="kicker rise">Tres equipos. Un solo cuerpo.</p><div class="tcols">' + cols + '</div>' +
      '<p class="note rise d5">Cada equipo ya recibió sus piezas. Cada misión las pone en acción.</p></div>';
  }

  function discBadge(c) {
    var d = DISCIPLINES[c.disc] || DISCIPLINES.colectivo;
    return '<span class="disc-b">' + icon(d.icon) + esc(d.label) + '</span>';
  }
  function vBrief() {
    var info = roundInfo(S, S.round);
    var cols = info.items.map(function (c, t) {
      var tm = team(t);
      return '<article class="rcard rise d' + (t + 2) + '" style="--tc:' + tm.color + '">' +
        '<header><span class="tname-s">' + esc(tm.name) + '</span><span class="rnum">RETO ' + pad2(challengeNumber(S, S.round, t)) + '</span></header>' +
        discBadge(c) + '<h2 class="rtitle">' + esc(c.title) + '</h2><p class="rtext">' + esc(c.text) + '</p>' +
        '<footer>' + icon('timer') + (+c.secs || 30) + ' s' + (c.disc === 'lsc' ? '<span class="lsc">' + icon('hand') + 'Sin voz · LSC</span>' : '') + '</footer></article>';
    }).join('');
    return '<div class="scene brief"><div class="rhead rise"><span class="rlabel">RONDA ' + pad2(S.round + 1) + '</span><span class="rname">' + esc(info.title) + '</span></div>' +
      '<div class="rcols">' + cols + '</div>' + (info.verse ? '<p class="note rise d5">“' + esc(info.verse.text) + '” <b>' + esc(info.verse.ref) + '</b></p>' : '<p class="note rise d5">Los tres equipos, al mismo tiempo.</p>') + '</div>';
  }

  function vTimer() {
    var info = roundInfo(S, S.round);
    var acts = info.items.map(function (c, t) {
      var tm = team(t);
      return '<article class="tact rise d' + (t + 2) + '" style="--tc:' + tm.color + '"><header><span class="tname-s">' + esc(tm.name) + '</span>' +
        (c.disc === 'lsc' ? '<span class="lsc">' + icon('hand') + 'Sin voz · LSC</span>' : '') + '</header>' +
        '<h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p></article>';
    }).join('');
    return '<div class="scene timer"><span class="rlabel rise">RONDA ' + pad2(S.round + 1) + ' · ' + esc(info.title) + '</span>' +
      '<div class="tbody"><div class="clock" id="clock"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="46"/><circle class="prog" id="ring" cx="50" cy="50" r="46" stroke-dasharray="' + ringC + '" stroke-dashoffset="0"/></svg>' +
      '<span class="num" id="num"></span><span class="tlabel2" id="tlabel"></span></div><div class="tacts">' + acts + '</div></div></div>';
  }
  function updateTimer(force) {
    if (!S || S.scene !== 'timer') return;
    var left = timerLeft(S.timer), total = Math.max(1, S.timer.dur * 1000), secs = Math.ceil(left / 1000);
    var clock = $('#clock'); if (!clock) return;
    var started = S.timer.running || left < total;
    var over = started && left <= 0;
    if (secs !== lastSec || force) {
      if (lastSec !== null && !over && S.timer.running) { if (secs <= 3) Sound.play('last'); else if (secs <= 10) Sound.play('tick'); }
      if (over && lastSec !== 0 && lastSec !== null) Sound.play('time');
      lastSec = over ? 0 : secs;
      $('#num').textContent = over ? '¡TIEMPO!' : secs;
      $('#tlabel').textContent = over ? '' : (!started ? 'Preparados' : (S.timer.running ? '' : 'Pausa'));
      clock.classList.toggle('last', secs <= 10 && !over && started);
      clock.classList.toggle('final', secs <= 3 && !over && started);
      clock.classList.toggle('over', over);
      if (secs <= 3 && !over && S.timer.running) { clock.classList.remove('beat'); void clock.offsetWidth; clock.classList.add('beat'); }
    }
    $('#ring').style.strokeDashoffset = ringC * (1 - left / total);
  }

  function vComplete(prev) {
    var cols = [0, 1, 2].map(function (t) {
      var id = S.round + '-' + t, tm = team(t), has = !!S.done[id], fresh = has && (!prev || !prev.done[id]);
      return '<div class="ccol' + (has ? ' has' : '') + (fresh ? ' fresh' : '') + '" style="--tc:' + tm.color + '">' +
        '<div class="piece-wrap' + (pm(S.cfg) > 1 ? ' two' : '') + '">' + pieceStack(S.round, t, tm.color, has) + '</div>' +
        '<b class="cname">' + esc(tm.name) + '</b><span class="cstate">' + (has ? 'Puesta en acción' : 'Recibida · en espera') + '</span></div>';
    }).join('');
    var any = [0, 1, 2].some(function (t) { return S.done[S.round + '-' + t]; });
    return '<h1 class="ctitle' + (any ? '' : ' wait') + '">' + (any ? '¡PUESTA EN ACCIÓN!' : 'MISIÓN EN CURSO') + '</h1>' +
      '<div class="ccols">' + cols + '</div><p class="count">' + piecesDone(S) + ' / ' + totalPieces(S) + '</p>';
  }

  function vProgress() {
    var have = {}; S.order.forEach(function (id) { var rt = id.split('-'); pieceIds(S.cfg, +rt[0], +rt[1]).forEach(function (p) { have[p] = true; }); });
    var colors = S.cfg.teams.map(function (t) { return t.color; });
    var rows = [0, 1, 2].map(function (t) {
      var tm = team(t), n = haveCount(t);
      return '<div class="prow" style="--tc:' + tm.color + '"><b>' + esc(tm.name) + '</b><span class="bar"><i style="width:' + (n / gridRows(S.cfg) * 100) + '%"></i></span><span>' + n + '/' + gridRows(S.cfg) + '</span>' +
        (S.cfg.scoreOn ? '<span class="pts">' + (S.points[t] || 0) + ' pts</span>' : '') + '</div>';
    }).join('');
    return '<div class="pboard">' + Figure.board({ rows: gridRows(S.cfg), colors: colors, have: have, mode: 'progress' }) + '</div>' +
      '<div class="pside"><p class="kicker">Diferentes funciones</p><p class="big-count"><b>' + piecesDone(S) + '</b><span>/ ' + totalPieces(S) + '</span></p>' +
      '<p class="pl">piezas</p><div class="prows">' + rows + '</div></div>';
  }

  /* ---------- Ruleta del Cuerpo ---------- */
  function wheelSvg() {
    var sl = S.cfg.wheel.slices, n = sl.length, step = 360 / n, cols = ['#F2B84B', '#5BC8F5', '#B9A3FF', '#7FD6B0', '#F28C8C', '#E6E6F0'], p = '';
    function pt(a, r) { var t = a * Math.PI / 180; return (100 + r * Math.sin(t)).toFixed(2) + ' ' + (100 - r * Math.cos(t)).toFixed(2); }
    sl.forEach(function (x, i) {
      p += '<path d="M100 100 L' + pt(i * step - step / 2, 92) + ' A92 92 0 0 1 ' + pt(i * step + step / 2, 92) + ' Z" fill="' + cols[i % cols.length] + '" stroke="#050E2B" stroke-width="1.5"/>' +
        '<text class="wl" x="100" y="32" text-anchor="middle" transform="rotate(' + (i * step) + ' 100 100)">' + esc(String(x.label).toUpperCase()) + '</text>';
    });
    return '<svg class="wsvg" viewBox="0 0 200 200" aria-hidden="true"><g id="wdisk">' + p + '</g><circle cx="100" cy="100" r="9" fill="#050E2B" stroke="#F2B84B" stroke-width="2"/><path d="M92 -2 L108 -2 L100 17 Z" fill="#F2B84B" stroke="#050E2B" stroke-width="1"/></svg>';
  }
  function wheelSide(done) {
    var sl = S.wheel && S.cfg.wheel.slices[S.wheel.idx];
    if (done && sl) return '<p class="kicker rise">' + esc(sl.label) + '</p><h2 class="wact rise d2">' + esc(sl.action) + '</h2><p class="wverse rise d4">“' + esc(sl.verse.text) + '” <b>' + esc(sl.verse.ref) + '</b></p>';
    return '<p class="kicker rise">Ruleta del Cuerpo</p><h2 class="wact idle rise d2">Muchos miembros, un solo cuerpo.</h2><p class="wverse rise d4">La ruleta no reparte dones: elige qué hacemos todos, a la vez, en este momento.</p>';
  }
  function vWheel() {
    return '<div class="scene wheel"><div class="wwrap rise">' + wheelSvg() + '</div><div class="wside" id="wside">' + wheelSide(S.wheel && S.wheel.idx >= 0) + '</div></div>';
  }
  function initWheel() {
    var d = $('#wdisk'); if (!d) return;
    var done = S.wheel && S.wheel.idx >= 0, step = 360 / S.cfg.wheel.slices.length;
    wheelRot = done ? -S.wheel.idx * step : 0;
    d.style.transition = 'none'; d.style.transform = 'rotate(' + wheelRot + 'deg)';
  }
  function spinWheel() {
    var d = $('#wdisk'), side = $('#wside'); if (!d || !side) return;
    clearLater();
    var step = 360 / S.cfg.wheel.slices.length, jitter = (Math.random() - .5) * step * .5, ms = REDUCED ? 700 : 5200;
    wheelRot = Math.ceil(wheelRot / 360) * 360 + 360 * 5 - S.wheel.idx * step + jitter;
    side.innerHTML = '<p class="kicker">Ruleta del Cuerpo</p><h2 class="wact idle">…</h2>';
    void d.getBoundingClientRect();
    d.style.transition = REDUCED ? 'none' : 'transform 5.2s cubic-bezier(.12,.72,.12,1)';
    d.style.transform = 'rotate(' + wheelRot + 'deg)';
    Sound.play('transition');
    later(function () { side.innerHTML = wheelSide(true); Sound.play('complete'); }, ms + 200);
  }
  function vPause() {
    var p = S.cfg.pause || {}, v = p.verse || {};
    return '<div class="scene pause"><p class="kicker rise">' + esc(p.title || 'Un momento de silencio') + '</p><p class="pq rise d2">' + esc(p.question) + '</p>' +
      '<p class="ref rise d4">“' + esc(v.text) + '” · ' + esc(v.ref) + '</p><span class="pbar"><i style="animation-duration:' + (+p.secs || 60) + 's"></i></span></div>';
  }

  function vVerse() {
    var v = S.cfg.verses[S.verse] || S.cfg.verses.main;
    return '<div class="scene verse"><p class="scripture rise">“' + esc(v.text) + '”</p><p class="ref rise d3">' + esc(v.ref) + '</p></div>';
  }

  /* ---------- Final ---------- */
  function vFinale() {
    var c = S.cfg, colors = c.teams.map(function (t) { return t.color; });
    if (S.seg === 0) {
      return '<div class="scene finale f0"><div class="fboard" id="fboard">' + Figure.board({ rows: gridRows(c), colors: colors, mode: 'assembly' }) + '</div>' +
        '<div class="fwords" id="fwords"></div></div>';
    }
    if (S.seg === 1) {
      return '<div class="scene finale f1"><div class="layer" id="m1"><p class="stack"><span>LOS DONES LOS REPARTE EL ESPÍRITU.</span><span>LOS TALENTOS SE NOS CONFÍAN.</span><span>TODO VIENE DE DIOS.</span></p></div>' +
        '<div class="layer" id="m2"><p class="stack gold"><span>TODO ES PARA SERVIR</span><span>Y EDIFICAR A LOS OTROS</span><span>CON AMOR.</span></p></div>' +
        '<div class="layer" id="m3"><p class="scripture">“' + esc((c.verses.servir || c.verses.main).text) + '”</p><p class="ref">' + esc((c.verses.servir || c.verses.main).ref) + '</p></div></div>';
    }
    if (S.seg === 2) {
      return '<div class="scene finale f2"><div class="ghost-fig">' + Figure.board({ rows: gridRows(c), colors: colors, mode: 'whole' }) + '</div>' +
        '<p class="stack big rise"><span>¿QUÉ ESTÁS HACIENDO</span><span>CON LO QUE DIOS TE DIO?</span></p><p class="ref rise d3">“' + esc((c.verses.final || c.verses.main).text) + '” · ' + esc((c.verses.final || c.verses.main).ref) + '</p></div>';
    }
    if (S.seg === 3) {
      return '<div class="scene finale f2"><div class="ghost-fig">' + Figure.board({ rows: gridRows(c), colors: colors, mode: 'whole' }) + '</div>' +
        '<p class="stack big rise"><span>MI PIEZA</span><span>LO QUE DIOS ME DIO</span></p>' +
        '<p class="note rise d4">Escríbelo en tu ficha: una palabra o una frase. Si quieres, pásala al frente y forma parte del cuerpo.</p></div>';
    }
    return '<div class="scene finale f3"><div class="rise">' + logos() + '</div>' +
      '<p class="cr1 rise d2">' + esc(c.credits.line1) + '</p><p class="cr2 rise d2">' + esc(c.credits.line2) + '</p>' +
      '<p class="cr3 rise d3">' + esc(c.credits.line3) + '</p><p class="cr1 rise d3">' + esc(c.credits.line4) + '</p>' +
      '<p class="cr4 rise d4">' + esc(c.credits.tagline) + '</p><p class="cr5 rise d5">' + esc(c.church) + '</p></div>';
  }

  function runFinale() {
    if (S.seg === 1) {
      var show = function (id) { $$('.f1 .layer').forEach(function (l) { l.classList.toggle('on', l.id === id); }); };
      later(function () { show('m1'); }, 400); later(function () { show('m2'); }, 7400); later(function () { show('m3'); }, 14600);
      return;
    }
    if (S.seg !== 0) return;
    var svg = $('#fboard svg'), groups = $$('#fboard .pc'), words = $('#fwords');
    var R = function (a, b) { return a + Math.random() * (b - a); };
    groups.forEach(function (g) {
      var a = R(0, Math.PI * 2), d = R(170, 300);
      g.style.transform = 'translate(' + (Math.cos(a) * d).toFixed(0) + 'px,' + (Math.sin(a) * d * .8).toFixed(0) + 'px) rotate(' + R(-60, 60).toFixed(0) + 'deg) scale(.72)';
    });
    var order = groups.slice().sort(function () { return Math.random() - .5; });
    var t = 1800, step = REDUCED ? 0 : 170;
    order.forEach(function (g, i) { later(function () { g.classList.add('in'); if (i % 3 === 0) Sound.play('piece'); }, t + i * step); });
    t += order.length * step + 900;
    later(function () { svg.classList.add('gather'); order.forEach(function (g, i) { g.style.transitionDelay = (i * 0.07) + 's'; g.style.transform = ''; }); Sound.play('transition'); }, t);
    t += 3800;
    later(function () { svg.classList.add('reveal'); }, t);
    t += 2600;
    later(function () { svg.classList.add('fuse'); Sound.play('assemble'); }, t);
    t += 4200;
    var phrases = ['MUCHOS DONES.', 'MUCHOS TALENTOS.', 'UN SOLO CUERPO.', 'UN MISMO PROPÓSITO.'];
    later(function () { $('.f0').classList.add('aside'); }, t);
    phrases.forEach(function (p, i) {
      later(function () { words.innerHTML = '<p class="phrase' + (i === 3 ? ' gold' : '') + '">' + p + '</p>'; }, t + 900 + i * 2700);
    });
    t += 900 + phrases.length * 2700;
    var v = S.cfg.verses.main;
    later(function () { words.innerHTML = '<p class="scripture">“' + esc(v.text) + '”</p><p class="ref">' + esc(v.ref) + '</p>'; }, t);
    later(function () { words.innerHTML = '<p class="phrase huge gold">' + esc(S.cfg.title) + '.</p>'; Sound.play('complete'); }, t + 6500);
  }

  function transition() {
    var fx = $('#fx'); fx.classList.remove('run'); void fx.offsetWidth; fx.classList.add('run'); Sound.play('transition');
  }

  /* ---------- Inicio ---------- */
  function attach(demo) {
    isDemo = !!demo;
    if (attached) return; attached = true;
    root = $('#stage');
    document.body.classList.add('mode-screen');
    tick = setInterval(updateTimer, 100);
    var hideT; document.addEventListener('mousemove', function () { document.body.classList.remove('nocursor'); clearTimeout(hideT); hideT = setTimeout(function () { document.body.classList.add('nocursor'); }, 2500); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'f' || e.key === 'F') { var d = document; if (!d.fullscreenElement) { d.documentElement.requestFullscreen && d.documentElement.requestFullscreen().catch(function () {}); } else d.exitFullscreen(); }
    });
  }
  function start() {
    attach(false);
    Sync.onState(function (st, src) { if (src === 'hello') return; apply(st); });
    var cached = Sync.cached();
    apply(cached && cached.cfg ? cached : freshState(loadConfig()));
    Sync.hello();
    // Indicador de conexión solo durante los primeros segundos
    var pill = $('#scrStatus');
    Sync.onStatus(function (s) { pill.textContent = s === 'lan' ? 'Conectado al presentador' : s === 'cloud' ? 'Conectado en línea' : s === 'wait' ? 'Esperando al presentador…' : s === 'connecting' ? 'Conectando…' : s === 'error' ? 'Sin conexión: modo local' : 'Modo local'; });
    setTimeout(function () { pill.classList.add('gone'); }, 6000);
  }
  return { start: start, attach: attach, apply: apply, state: function () { return S; } };
})();
