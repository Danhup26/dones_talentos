/* =====================================================================
   TRANSICIONES DE ESTADO (las usan el presentador y la demostración)
   ===================================================================== */
var T = {
  go: function (s, scene, extra) {
    s.hist = (s.hist || []).concat([{ scene: s.scene, round: s.round, seg: s.seg }]).slice(-40);
    s.scene = scene; s.key++; s.editOpen = false;
    if (extra) Object.keys(extra).forEach(function (k) { s[k] = extra[k]; });
  },
  readyTimer: function (s) { var secs = roundInfo(s, s.round).secs; s.timer = { dur: secs, endsAt: 0, left: secs * 1000, running: false }; },
  startTimer: function (s) { if (s.timer.left <= 0) s.timer.left = s.timer.dur * 1000; s.timer.running = true; s.timer.endsAt = nowMs() + s.timer.left; s.paused = false; },
  pauseTimer: function (s) { if (!s.timer.running) return; s.timer.left = Math.max(0, s.timer.endsAt - nowMs()); s.timer.running = false; },
  addTime: function (s, sec) { if (s.timer.running) s.timer.endsAt += sec * 1000; else s.timer.left += sec * 1000; s.timer.dur = Math.max(s.timer.dur, Math.ceil(timerLeft(s.timer) / 1000)); },
  stopTimer: function (s) { s.timer.running = false; s.timer.left = 0; },
  mark: function (s, t, on) {
    var id = s.round + '-' + t;
    if (on && !s.done[id]) { s.done[id] = true; s.order.push(id); s.last = id; if (s.cfg.scoreOn) s.points[t] = (s.points[t] || 0) + 1; }
    if (!on && s.done[id]) { delete s.done[id]; s.order = s.order.filter(function (x) { return x !== id; }); if (s.cfg.scoreOn) s.points[t] = Math.max(0, (s.points[t] || 0) - 1); }
    if (on && (s.scene === 'timer' || s.scene === 'brief')) { T.pauseTimer(s); T.go(s, 'complete'); }
  },
  addPiece: function (s, t) { for (var r = 0; r < s.cfg.rounds; r++) { var id = r + '-' + t; if (!s.done[id]) { s.done[id] = true; s.order.push(id); s.last = id; return; } } },
  removePiece: function (s, t) { for (var i = s.order.length - 1; i >= 0; i--) { var id = s.order[i]; if (+id.split('-')[1] === t) { delete s.done[id]; s.order.splice(i, 1); return; } } },
  resetProgress: function (s) {
    s.round = 0; s.seg = 0; s.done = {}; s.order = []; s.last = null; s.points = [0, 0, 0];
    s.paused = false; s.resume = null; s.wheel = null; s.wheelUsed = []; s.hist = []; s.verse = 'main';
    T.readyTimer(s);
  },
  wheelAfter: function (s) { var w = s.cfg.wheel; return !!w && (w.after || []).indexOf(s.round) >= 0; },
  wheelReset: function (s) { return { wheel: { n: (s.wheel && s.wheel.n) || 0, idx: -1 } }; },
  spin: function (s) {
    var len = s.cfg.wheel.slices.length, used = s.wheelUsed || [], pool = [], i;
    for (i = 0; i < len; i++) if (used.indexOf(i) < 0) pool.push(i);
    if (!pool.length) { used = []; for (i = 0; i < len; i++) pool.push(i); }
    var idx = pool[Math.floor(Math.random() * pool.length)];
    s.wheelUsed = used.concat([idx]);
    s.wheel = { n: ((s.wheel && s.wheel.n) || 0) + 1, idx: idx };
  },
  advanceRound: function (s) {
    if (s.round < s.cfg.rounds - 1) { s.round++; T.readyTimer(s); return T.go(s, 'brief'); }
    return T.go(s, 'pause');
  },
  next: function (s) {
    var sc = s.scene;
    if (sc === 'safe' || sc === 'black') { if (s.resume) { var r = s.resume; s.resume = null; return T.go(s, r); }
      if (!s.live) T.resetProgress(s);   // un culto nuevo siempre empieza desde cero
      s.live = true; return T.go(s, 'intro'); }
    if (sc === 'intro') return T.go(s, 'teams');
    if (sc === 'teams') { T.readyTimer(s); return T.go(s, 'brief'); }
    if (sc === 'brief') { T.readyTimer(s); return T.go(s, 'timer'); }
    if (sc === 'timer') {
      var left = timerLeft(s.timer);
      if (!s.timer.running && left >= s.timer.dur * 1000) return T.startTimer(s);
      if (s.timer.running) return T.stopTimer(s);
      return T.go(s, 'complete');
    }
    if (sc === 'complete') return T.go(s, 'progress');
    if (sc === 'progress' || sc === 'verse') {
      if (sc === 'verse' && s.resume) { var rr = s.resume; s.resume = null; return T.go(s, rr); }
      if (sc === 'progress' && s.round < s.cfg.rounds - 1 && T.wheelAfter(s)) return T.go(s, 'wheel', T.wheelReset(s));
      return T.advanceRound(s);
    }
    if (sc === 'wheel') { if (!s.wheel || s.wheel.idx < 0) return T.spin(s); return T.advanceRound(s); }
    if (sc === 'pause') return T.go(s, 'finale', { seg: 0 });
    if (sc === 'finale') { if (s.seg < 4) { s.seg++; s.key++; return; } s.live = false; s.resume = null; return T.go(s, 'safe'); }
  },
  nextLabel: function (s) {
    var sc = s.scene;
    if (sc === 'safe' || sc === 'black') return s.resume ? 'Volver a la experiencia' : (!s.live && s.order.length ? 'Iniciar experiencia (desde cero)' : 'Iniciar experiencia');
    if (sc === 'intro') return 'Presentar los equipos';
    if (sc === 'teams') return 'Mostrar retos · Ronda 1';
    if (sc === 'brief') return 'Mostrar cronómetro';
    if (sc === 'timer') { var l = timerLeft(s.timer); if (!s.timer.running && l >= s.timer.dur * 1000) return 'Iniciar cronómetro'; if (s.timer.running) return '¡Tiempo! (detener)'; return 'Mostrar misiones'; }
    if (sc === 'complete') return 'Mostrar progreso';
    var lastLabel = s.round < s.cfg.rounds - 1 ? 'Siguiente ronda · ' + (s.round + 2) : 'Pausa de silencio';
    if (sc === 'progress' || sc === 'verse') return (sc === 'progress' && s.round < s.cfg.rounds - 1 && T.wheelAfter(s)) ? 'Ruleta del Cuerpo' : lastLabel;
    if (sc === 'wheel') return (!s.wheel || s.wheel.idx < 0) ? 'Girar la ruleta' : lastLabel;
    if (sc === 'pause') return 'Gran final: ensamblar';
    if (sc === 'finale') return ['Mensaje final', 'Pregunta final', 'Mi pieza', 'Créditos', 'Volver a estado seguro'][s.seg];
    return 'Siguiente';
  },
  back: function (s) {
    var h = (s.hist || []).pop(); if (!h) return;
    s.scene = h.scene; s.round = h.round; s.seg = h.seg || 0; s.key++;
    if (s.scene === 'timer' || s.scene === 'brief') T.readyTimer(s);
  },
  safe: function (s) {
    T.pauseTimer(s);
    if (s.scene !== 'safe') s.resume = (s.scene === 'timer' ? 'brief' : s.scene);
    s.scene = 'safe'; s.key++; s.paused = false;
  }
};

var SCENE_NAMES = { safe: 'Estado seguro', intro: 'Introducción', teams: 'Equipos', brief: 'Retos', timer: 'Cronómetro', complete: 'Misiones', progress: 'Progreso', wheel: 'Ruleta del Cuerpo', pause: 'Silencio', verse: 'Versículo', finale: 'Final', black: 'Pantalla negra' };

/* =====================================================================
   MODO PRESENTADOR (celular)
   ===================================================================== */
var Control = (function () {
  var S, tab = 'live', root, armedKey = null, armedT = null, openId = null, softT = null, pinAsked = false, drawer = false, lastNext = 0, holdT = null, lastSig = '';

  function saveCfg() { try { localStorage.setItem(STORE_CFG, JSON.stringify(S.cfg)); } catch (e) {} }
  function commit(fn, opts) {
    if (fn) fn(S);
    var sg0 = S.scene + '|' + S.round; if (sg0 !== lastSig) { drawer = false; lastSig = sg0; }
    S.rev++; S.at = nowMs();
    Sync.publish(S);
    if (opts && opts.cfg) saveCfg();
    if (!opts || !opts.quiet) render();
  }
  function arm(key, fn) {
    if (armedKey === key) { armedKey = null; clearTimeout(armedT); fn(); return; }
    armedKey = key; render(); clearTimeout(armedT);
    armedT = setTimeout(function () { armedKey = null; render(); }, 3500);
  }

  /* ---------- Vistas ---------- */
  function btn(act, label, ic, cls, v) {
    return '<button class="cb ' + (cls || '') + '" data-a="' + act + '"' + (v !== undefined ? ' data-v="' + esc(v) + '"' : '') + '>' + (ic ? icon(ic) : '') + '<span>' + label + '</span></button>';
  }
  function head() {
    var st = Sync.status(), map = { lan: ['ok', 'Conectado a la pantalla'], cloud: ['ok', 'En línea'], connecting: ['wait', 'Conectando'], wait: ['wait', 'Esperando la pantalla…'], pin: ['bad', 'Falta el PIN'], error: ['bad', 'Reconectando…'], local: ['loc', 'Modo local'] };
    var m = map[st] || map.local;
    return '<header class="ch"><div class="cbrand">DONES Y TALENTOS</div><span class="cstat ' + m[0] + '"><i></i>' + m[1] + '</span></header>' +
      '<div class="onair"><span>En pantalla</span><b>' + (SCENE_NAMES[S.scene] || S.scene) + (S.scene === 'finale' ? ' · ' + (S.seg + 1) + '/5' : '') + '</b><em>Ronda ' + (S.round + 1) + '/' + S.cfg.rounds + ' · ' + piecesDone(S) + '/' + totalPieces(S) + ' piezas</em></div>';
  }
  var HINTS = {
    safe: 'La pantalla muestra el título.', intro: 'Introducción en marcha.', teams: 'Se están presentando los equipos.',
    brief: 'Los equipos leen sus actividades.', timer: 'Inicia el cronómetro; marca cada equipo cuando cumpla.', complete: 'Marca a cada equipo que puso su misión en acción.',
    progress: 'Se muestra el rompecabezas.', wheel: 'Gira la ruleta: todos hacen la acción a la vez.', pause: 'Silencio y reflexión.', verse: 'Versículo en pantalla.',
    finale: 'Gran final.', black: 'Pantalla en negro.'
  };
  function lockedCard(title, ic, where) { return '<section class="card locked"><h3>' + icon(ic) + title + '<small>Se activa en: ' + where + '</small></h3></section>'; }
  function timerCard() {
    var left = timerLeft(S.timer);
    return '<section class="card"><h3>' + icon('timer') + 'Cronómetro</h3><div class="ctime" id="ctime">' + Math.ceil(left / 1000) + '</div>' +
      '<div class="row4">' + (S.timer.running ? btn('tpause', 'Pausar', 'pause') : btn('tstart', 'Iniciar', 'play', 'go')) +
      btn('tplus', '+10 s', 'plus') + btn('treset', 'Reiniciar', 'restart') + btn('tstop', '¡Tiempo!', 'x') + '</div></section>';
  }
  function missionsCard(info) {
    return '<section class="card"><h3>' + icon('check') + 'Misiones · Ronda ' + (S.round + 1) + '</h3><p class="muted">' + esc(info.title) + '</p>' +
      [0, 1, 2].map(function (t) {
        var tm = S.cfg.teams[t], on = !!S.done[S.round + '-' + t];
        return '<button class="mission' + (on ? ' on' : '') + '" data-a="mark" data-v="' + t + '" style="--tc:' + tm.color + '"><i></i><span><b>' + esc(tm.name) + '</b><small>' + esc(info.items[t].title) + '</small></span><em>' + (on ? icon('check') + 'En acción' : 'Poner en acción') + '</em></button>';
      }).join('') + '</section>';
  }
  function drawerCard(info) {
    if (!drawer) return '<section class="card"><button class="hold" data-hold="drawer" type="button"><span class="hbar"></span><span>' + icon('shield') + ' Corrección de emergencia · mantén presionado</span></button></section>';
    var chips = ''; for (var r = 0; r < S.cfg.rounds; r++) chips += '<button class="chip' + (r === S.round ? ' on' : '') + '" data-a="round" data-v="' + r + '">' + (r + 1) + '</button>';
    var verses = Object.keys(S.cfg.verses).map(function (k) { return '<option value="' + k + '"' + (k === S.verse ? ' selected' : '') + '>' + esc(S.cfg.verses[k].ref) + '</option>'; }).join('');
    var h = '<section class="card drawer"><h3>' + icon('shield') + 'Corrección de emergencia</h3><p class="muted">Cambia lo que ya está en marcha. Úsalo solo si algo salió mal. Se cierra al cambiar de escena.</p>';
    h += '<h4>Ir a la ronda</h4><div class="chips">' + chips + '</div>' +
      [0, 1, 2].map(function (t) {
        var opts = S.cfg.challenges.map(function (c) { return '<option value="' + c.id + '"' + (c.id === S.cfg.plan[S.round].picks[t] ? ' selected' : '') + '>' + esc(c.title) + ' (' + c.secs + ' s)</option>'; }).join('');
        return '<label class="sel"><span style="color:' + S.cfg.teams[t].color + '">' + esc(S.cfg.teams[t].name) + '</span><select data-c="pick" data-v="' + t + '">' + opts + '</select></label>';
      }).join('');
    h += '<h4>Piezas · ' + piecesDone(S) + '/' + totalPieces(S) + '</h4>' + [0, 1, 2].map(function (t) {
      var n = 0; for (var r = 0; r < S.cfg.rounds; r++) if (S.done[r + '-' + t]) n++;
      return '<div class="prow-c" style="--tc:' + S.cfg.teams[t].color + '"><i></i><b>' + esc(S.cfg.teams[t].name) + '</b><span>' + (n * pm(S.cfg)) + '/' + gridRows(S.cfg) + '</span>' +
        btn('pminus', '', 'minus', 'sq', t) + btn('pplus', '', 'plus', 'sq', t) + '</div>';
    }).join('');
    h += '<h4>Ir a pantalla</h4><div class="grid3">' +
      btn('scene', 'Intro', '', '', 'intro') + btn('scene', 'Equipos', '', '', 'teams') + btn('scene', 'Retos', '', '', 'brief') +
      btn('scene', 'Cronómetro', '', '', 'timer') + btn('scene', 'Misiones', '', '', 'complete') + btn('scene', 'Progreso', '', '', 'progress') +
      btn('seg', 'Ensamblaje', '', '', 0) + btn('seg', 'Mensaje', '', '', 1) + btn('seg', 'Pregunta', '', '', 2) +
      btn('seg', 'Mi pieza', '', '', 3) + btn('seg', 'Créditos', '', '', 4) + btn('scene', 'Ruleta', '', '', 'wheel') + btn('scene', 'Silencio', '', '', 'pause') + btn('scene', 'Negro', '', '', 'black') + btn('scene', 'Título', '', '', 'safe') +
      '</div><div class="vrow"><select data-c="verse">' + verses + '</select>' + btn('verse', 'Mostrar versículo', 'book', 'go') + '</div>';
    h += '<h4>Experiencia</h4><div class="row2">' +
      btn('pauseall', S.paused ? 'Reanudar' : 'Pausar todo', S.paused ? 'play' : 'pause') +
      btn('resetall', armedKey === 'resetall' ? '¿Seguro? Toca otra vez' : 'Reiniciar todo', 'restart', armedKey === 'resetall' ? 'danger' : '') + '</div>' +
      btn('drawerclose', 'Cerrar corrección', 'x', 'ghost') + '</section>';
    return h;
  }
  function vLive() {
    var info = roundInfo(S, S.round), sc = S.scene, h = '';
    h += '<section class="card hero">' + btn('next', T.nextLabel(S), 'play', 'primary') + '<p class="hint">' + (HINTS[sc] || '') + '</p>' +
      '<div class="row2">' + btn('back', 'Anterior', 'left', 'ghost') + btn('fx', 'Transición', 'film', 'ghost') + '</div></section>';

    if (sc === 'wheel') {
      var wl = S.wheel && S.cfg.wheel.slices[S.wheel.idx];
      h += '<section class="card"><h3>' + icon('sparkle') + 'Ruleta del Cuerpo</h3>' +
        (wl ? '<p class="muted"><b>' + esc(wl.label) + ':</b> ' + esc(wl.action) + '</p>' : '<p class="muted">Aún no ha girado. Toca «Girar la ruleta» (o el botón grande).</p>') +
        btn('spin', wl ? 'Girar de nuevo' : 'Girar la ruleta', 'sparkle', 'go') + '</section>';
    }
    if ((sc === 'safe' || sc === 'black') && (S.order.length || S.round > 0 || S.live || S.resume)) {
      h += '<section class="card"><h3>' + icon('restart') + 'Culto nuevo</h3><p class="muted">Hay progreso guardado: ronda ' + (S.round + 1) + '/' + S.cfg.rounds + ' · ' + piecesDone(S) + '/' + totalPieces(S) + ' piezas. Para empezar desde la ronda 1 con 0 piezas:</p>' +
        btn('newrun', armedKey === 'newrun' ? '¿Seguro? Toca otra vez' : 'Empezar desde cero', 'restart', armedKey === 'newrun' ? 'danger' : 'go') + '</section>';
    }
    var inRound = /^(brief|timer|complete|progress)$/.test(sc);
    if (sc === 'timer') h += timerCard(); else if (inRound) h += lockedCard('Cronómetro', 'timer', 'la escena Cronómetro');
    if (sc === 'timer' || sc === 'complete') h += missionsCard(info); else if (inRound) h += lockedCard('Misiones', 'check', 'Cronómetro y Misiones');

    h += drawerCard(info) + '<div class="spacer"></div>';
    return h;
  }

  function field(label, attrs, val, type) {
    if (type === 'area') return '<label class="fld"><span>' + label + '</span><textarea ' + attrs + ' rows="3">' + esc(val) + '</textarea></label>';
    return '<label class="fld"><span>' + label + '</span><input ' + attrs + ' type="' + (type || 'text') + '" value="' + esc(val) + '"></label>';
  }
  function vRetos() {
    var c = S.cfg, h = '<section class="card"><h3>' + icon('list') + 'Plan de rondas</h3><p class="muted">Cada ronda da una pieza por equipo.</p>';
    for (var r = 0; r < c.rounds; r++) {
      h += '<div class="plan"><b>Ronda ' + (r + 1) + '</b>' + field('Nombre de la ronda', 'data-c="ptitle" data-v="' + r + '"', c.plan[r].title) +
        '<label class="sel"><span>Versículo de la ronda</span><select data-c="pverse" data-v="' + r + '">' + Object.keys(c.verses).map(function (k) { return '<option value="' + k + '"' + (k === c.plan[r].verse ? ' selected' : '') + '>' + esc(c.verses[k].ref) + '</option>'; }).join('') + '</select></label>';
      for (var t = 0; t < 3; t++) {
        var opts = c.challenges.map(function (x) { return '<option value="' + x.id + '"' + (x.id === c.plan[r].picks[t] ? ' selected' : '') + '>' + esc(x.title) + '</option>'; }).join('');
        h += '<label class="sel"><span style="color:' + c.teams[t].color + '">' + esc(c.teams[t].name) + '</span><select data-c="ppick" data-v="' + r + '-' + t + '">' + opts + '</select></label>';
      }
      h += '</div>';
    }
    h += '</section><section class="card"><h3>' + icon('sparkle') + 'Actividades (' + c.challenges.length + ')</h3><p class="muted">Toca una actividad para cambiar su nombre, tipo, tiempo e instrucción. Se ve al instante en la pantalla.</p>';
    c.challenges.forEach(function (x, i) {
      var ds = Object.keys(DISCIPLINES).map(function (k) { return '<option value="' + k + '"' + (k === x.disc ? ' selected' : '') + '>' + DISCIPLINES[k].label + '</option>'; }).join('');
      h += '<details class="ch-item" id="ch-' + x.id + '"' + (x.id === openId ? ' open' : '') + '><summary><b>' + esc(x.title) + '</b><small>' + (DISCIPLINES[x.disc] || {}).label + ' · ' + x.secs + ' s</small></summary>' +
        field('Título', 'data-c="ctitle" data-v="' + i + '"', x.title) +
        '<label class="fld"><span>Disciplina</span><select data-c="cdisc" data-v="' + i + '">' + ds + '</select></label>' +
        field('Segundos', 'data-c="csecs" data-v="' + i + '" min="5" max="180"', x.secs, 'number') +
        field('Instrucción (corta)', 'data-c="ctext" data-v="' + i + '"', x.text, 'area') +
        btn('cdel', armedKey === 'cdel' + i ? '¿Eliminar? Toca otra vez' : 'Eliminar actividad', 'trash', 'danger-soft', i) + '</details>';
    });
    h += btn('cadd', 'Agregar actividad', 'plus', 'go') + '</section><div class="spacer"></div>';
    return h;
  }
  function vEquipos() {
    var c = S.cfg, sw = ['#F2B84B', '#5BC8F5', '#B9A3FF', '#7FD6B0', '#F28C8C', '#E6E6F0'];
    var h = '<section class="card"><h3>' + icon('users') + 'Nombres y colores de los equipos</h3><p class="muted">Escribe el nombre y toca fuera del cuadro: se actualiza al instante en la pantalla.</p>';
    c.teams.forEach(function (tm, t) {
      h += '<div class="team-ed" style="--tc:' + tm.color + '">' + field('Equipo ' + (t + 1), 'data-c="tname" data-v="' + t + '" maxlength="20" autocomplete="off"', tm.name) +
        '<div class="swatches">' + sw.map(function (col) { return '<button class="sw' + (col.toLowerCase() === tm.color.toLowerCase() ? ' on' : '') + '" style="background:' + col + '" data-a="tcolor" data-v="' + t + '|' + col + '" aria-label="Color ' + col + '"></button>'; }).join('') +
        '<input type="color" data-c="tcolor" data-v="' + t + '" value="' + tm.color + '" aria-label="Otro color"></div></div>';
    });
    h += '</section><div class="spacer"></div>';
    return h;
  }
  function vAjustes() {
    var c = S.cfg;
    var h = '<section class="card"><h3>' + icon('sliders') + 'Opciones</h3>' +
      '<label class="fld"><span>Rondas</span><select data-c="rounds">' + [2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<option value="' + n + '"' + (n === c.rounds ? ' selected' : '') + '>' + n + ' rondas</option>'; }).join('') + '</select></label>' +
      '<label class="fld"><span>Piezas por misión</span><select data-c="perm">' + [1, 2].map(function (n) { return '<option value="' + n + '"' + (n === pm(c) ? ' selected' : '') + (n * c.rounds > 8 ? ' disabled' : '') + '>' + n + (n === 1 ? ' pieza' : ' piezas') + '</option>'; }).join('') + '</select></label>' +
      '<p class="muted">Rompecabezas: <b>' + (3 * gridRows(c)) + ' piezas</b> en total (3 equipos × ' + c.rounds + ' rondas × ' + pm(c) + '). Máximo 24 para que se vean bien en el proyector; con más de 4 rondas solo cabe 1 pieza por misión.</p>' +
      toggle('scoreOn', 'Puntos de participación', c.scoreOn) + toggle('soundOn', 'Sonido en la pantalla', c.soundOn) + toggle('accessible', 'Modo accesible (texto grande, menos movimiento)', c.accessible) +
      '</section><section class="card"><h3>' + icon('pen') + 'Textos</h3>' +
      field('Título', 'data-c="txt" data-v="title"', c.title) + field('Subtítulo', 'data-c="txt" data-v="subtitle"', c.subtitle) +
      field('Frase de apertura', 'data-c="txt" data-v="opening"', c.opening) + field('Iglesia', 'data-c="txt" data-v="church"', c.church) +
      '</section><section class="card"><h3>' + icon('book') + 'Versículos</h3>';
    Object.keys(c.verses).forEach(function (k) { h += '<div class="plan">' + field('Referencia', 'data-c="vref" data-v="' + k + '"', c.verses[k].ref) + field('Texto', 'data-c="vtext" data-v="' + k + '"', c.verses[k].text, 'area') + '</div>'; });
    h += '</section><section class="card"><h3>' + icon('sparkle') + 'Ruleta del Cuerpo</h3><p class="muted">La ruleta no reparte dones: elige qué hace todo el cuerpo a la vez.</p>';
    c.wheel.slices.forEach(function (sl, i) {
      h += '<details class="ch-item"><summary><b>' + esc(sl.label) + '</b><small>' + esc(sl.verse.ref) + '</small></summary>' +
        field('Nombre', 'data-c="wlabel" data-v="' + i + '"', sl.label) + field('Acción para todos', 'data-c="wact" data-v="' + i + '"', sl.action, 'area') +
        field('Versículo (referencia)', 'data-c="wref" data-v="' + i + '"', sl.verse.ref) + field('Versículo (texto)', 'data-c="wtext" data-v="' + i + '"', sl.verse.text, 'area') + '</details>';
    });
    h += '</section><section class="card"><h3>' + icon('moon') + 'Pausa de silencio</h3>' + field('Pregunta', 'data-c="pausaq"', c.pause.question, 'area') +
      field('Segundos', 'data-c="pausas" min="10" max="180"', c.pause.secs, 'number') + '</section><section class="card"><h3>' + icon('film') + 'Créditos</h3>';
    ['line1', 'line2', 'line3', 'line4', 'tagline'].forEach(function (k, i) { h += field('Línea ' + (i + 1), 'data-c="cred" data-v="' + k + '"', c.credits[k]); });
    h += '</section><section class="card"><h3>' + icon('volume') + 'Sonidos personalizados</h3><p class="muted">Opcional: pega la URL de un archivo de audio. Vacío = sonido incluido.</p>';
    Object.keys(c.sounds).forEach(function (k) { h += field(k, 'data-c="snd" data-v="' + k + '" placeholder="https://…"', c.sounds[k], 'url'); });
    h += '</section><section class="card"><h3>' + icon('shield') + 'Copia de seguridad</h3><p class="muted">Copia este texto para guardar tu configuración, o pega uno para restaurarla.</p>' +
      '<textarea class="json" id="cfgJson" rows="4">' + esc(JSON.stringify(c)) + '</textarea><div class="row2">' + btn('cfgcopy', 'Copiar', 'check') + btn('cfgload', 'Aplicar texto pegado', 'restart') + '</div>' +
      btn('cfgreset', armedKey === 'cfgreset' ? '¿Seguro? Toca otra vez' : 'Restablecer configuración original', 'restart', 'danger-soft') +
      '</section><section class="card"><h3>' + icon('phone') + 'Este dispositivo</h3>' + deviceInfo() + btn('role', 'Cambiar modo (Pantalla / Control)', 'tv') + btn('demo', 'Ver demostración aquí', 'play') + '</section><div class="spacer"></div>';
    return h;
  }
  function deviceInfo() {
    var i = Sync.info();
    if (!i || !i.ips || !i.ips.length) return '';
    return '<p class="muted">Dirección para el celular: ' + i.ips.map(function (ip) { return '<b>http://' + ip + ':' + i.port + '</b>'; }).join(' · ') + '</p>';
  }
  function toggle(key, label, on) { return '<button class="tgl' + (on ? ' on' : '') + '" data-a="opt" data-v="' + key + '"><span>' + label + '</span><i></i></button>'; }

  /* Edición bloqueada mientras el culto está en marcha (se desbloquea con confirmación hasta el próximo cambio de escena). */
  function locked() { return !!S.live && !S.editOpen; }
  var EMERG = { round: 1, scene: 1, seg: 1, verse: 1, pplus: 1, pminus: 1, pauseall: 1, resetall: 1 };
  var CFG_ACT = { opt: 1, tcolor: 1, cadd: 1, cdel: 1, cfgload: 1, cfgreset: 1, role: 1, demo: 1 };
  function allowedAct(a) {
    var sc = S.scene;
    if (/^t(start|pause|plus|reset|stop)$/.test(a)) return sc === 'timer';
    if (a === 'mark') return sc === 'timer' || sc === 'complete';
    if (a === 'spin') return sc === 'wheel';
    if (EMERG[a]) return drawer;
    if (CFG_ACT[a]) return !locked();
    return true;
  }
  /* Siempre disponible (Ajustes, fuera del bloqueo): vuelve a la ronda 1 con 0 piezas desde cualquier escena. */
  function newRunCard() {
    return '<section class="card"><h3>' + icon('restart') + 'Culto nuevo</h3><p class="muted">Ahora: ronda ' + (S.round + 1) + '/' + S.cfg.rounds + ' · ' + piecesDone(S) + '/' + totalPieces(S) + ' piezas. Para empezar desde la ronda 1 con 0 piezas y la pantalla en el título:</p>' +
      btn('newrun', armedKey === 'newrun' ? '¿Seguro? Toca otra vez' : 'Empezar desde cero', 'restart', armedKey === 'newrun' ? 'danger' : 'go') + '</section>';
  }
  function lockWrap(body) {
    if (!locked()) return body;
    return '<section class="card lockb"><h3>' + icon('shield') + 'Edición bloqueada</h3><p class="muted">El culto está en marcha: para no alterar la secuencia, los cambios están bloqueados.</p>' +
      btn('unlock', armedKey === 'unlock' ? '¿Seguro? Toca otra vez' : 'Desbloquear edición', 'pen', armedKey === 'unlock' ? 'danger' : 'danger-soft') + '</section><fieldset class="lockfs" disabled>' + body + '</fieldset>';
  }

  function render() {
    if (!root) return;
    var y = window.scrollY, body = tab === 'live' ? vLive() : (tab === 'ajustes' ? newRunCard() : '') + lockWrap(tab === 'equipos' ? vEquipos() : tab === 'retos' ? vRetos() : vAjustes());
    var openD = $$('details[open]', root).map(function (d) { return $$('details', root).indexOf(d); });
    root.innerHTML = head() + '<main class="cbody">' + body + '</main>' +
      (tab === 'live' ? '<button class="sos" data-a="safe">' + icon('shield') + 'VOLVER A ESTADO SEGURO</button>' : '') +
      '<nav class="tabs">' + [['live', 'En vivo', 'play'], ['equipos', 'Equipos', 'users'], ['retos', 'Actividades', 'list'], ['ajustes', 'Ajustes', 'sliders']].map(function (x) {
        return '<button class="' + (tab === x[0] ? 'on' : '') + '" data-a="tab" data-v="' + x[0] + '">' + icon(x[2]) + '<span>' + x[1] + '</span></button>'; }).join('') + '</nav>';
    var ds = $$('details', root); openD.forEach(function (i) { ds[i] && ds[i].setAttribute('open', ''); });
    openId = null;
    window.scrollTo(0, y);
  }
  /* Tras escribir en un cuadro de texto no se redibuja de inmediato: así se puede pasar de un campo al siguiente sin perder el foco. */
  function softRender() {
    clearTimeout(softT);
    softT = setTimeout(function () { var a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && root.contains(a)) return; render(); }, 500);
  }

  /* ---------- Acciones ---------- */
  function act(a, v, el) {
    if (!allowedAct(a)) return;
    if (a === 'next' || a === 'back') { var tnow = Date.now(); if (tnow - lastNext < 700) return; lastNext = tnow; }  // protege del doble toque
    switch (a) {
      case 'next': commit(T.next); break;
      case 'back': commit(T.back); break;
      case 'fx': commit(function (s) { s.fx++; }); break;
      case 'safe': commit(T.safe); break;
      case 'tstart': commit(function (s) { if (s.scene !== 'timer') T.go(s, 'timer'); T.startTimer(s); }); break;
      case 'tpause': commit(T.pauseTimer); break;
      case 'tplus': commit(function (s) { T.addTime(s, 10); }); break;
      case 'treset': commit(T.readyTimer); break;
      case 'tstop': commit(T.stopTimer); break;
      case 'mark': var t = +v, id = S.round + '-' + t;
        if (S.done[id]) arm('mark' + t, function () { commit(function (s) { T.mark(s, t, false); }); });
        else commit(function (s) { T.mark(s, t, true); });
        break;
      case 'editc': openId = v; tab = 'retos'; render(); var tgt = document.getElementById('ch-' + v); if (tgt) tgt.scrollIntoView({ block: 'start' }); break;
      case 'newrun': arm('newrun', function () { var cfg = S.cfg, rev = S.rev; S = freshState(cfg); S.hist = []; S.rev = rev; commit(); }); break;
      case 'unlock': arm('unlock', function () { commit(function (s) { s.editOpen = true; }); }); break;
      case 'drawerclose': drawer = false; render(); break;
      case 'spin': commit(function (s) { if (s.scene !== 'wheel') T.go(s, 'wheel', T.wheelReset(s)); T.spin(s); }); break;
      case 'round': commit(function (s) { s.round = +v; T.readyTimer(s); T.go(s, 'brief'); }); break;
      case 'pplus': commit(function (s) { T.addPiece(s, +v); }); break;
      case 'pminus': commit(function (s) { T.removePiece(s, +v); }); break;
      case 'scene': commit(function (s) { if (v === 'black' || v === 'verse') s.resume = s.scene; if (v === 'timer' || v === 'brief') T.readyTimer(s); T.go(s, v, v === 'wheel' ? T.wheelReset(s) : null); }); break;
      case 'seg': commit(function (s) { T.go(s, 'finale', { seg: +v }); }); break;
      case 'verse': commit(function (s) { if (s.scene !== 'verse') s.resume = s.scene; T.go(s, 'verse'); }); break;
      case 'pauseall': commit(function (s) { s.paused = !s.paused; if (s.paused) T.pauseTimer(s); }); break;
      case 'resetall': arm('resetall', function () { var cfg = S.cfg, rev = S.rev; S = freshState(cfg); S.rev = rev; commit(); }); break;
      case 'tab': tab = v; openId = null; render(); window.scrollTo(0, 0); break;
      case 'opt': commit(function (s) { s.cfg[v] = !s.cfg[v]; }, { cfg: true }); break;
      case 'tcolor': var p = v.split('|'); commit(function (s) { s.cfg.teams[+p[0]].color = p[1]; }, { cfg: true }); break;
      case 'cadd': commit(function (s) { var n = 1; while (s.cfg.challenges.some(function (c) { return c.id === 'n' + n; })) n++; openId = 'n' + n; s.cfg.challenges.push({ id: 'n' + n, title: 'Nueva actividad', disc: 'colectivo', secs: 30, text: 'Describe la misión en una o dos líneas.' }); }, { cfg: true }); break;
      case 'cdel': var i = +v; arm('cdel' + i, function () {
        if (S.cfg.challenges.length <= 3) { alert('Deben quedar al menos 3 actividades.'); return; }
        commit(function (s) { var id = s.cfg.challenges[i].id; s.cfg.challenges.splice(i, 1); var fb = s.cfg.challenges[0].id; s.cfg.plan.forEach(function (p) { p.picks = p.picks.map(function (x) { return x === id ? fb : x; }); }); }, { cfg: true }); });
        break;
      case 'cfgcopy': var ta = $('#cfgJson'); ta.select(); try { navigator.clipboard.writeText(ta.value); } catch (e) { document.execCommand('copy'); } el.querySelector('span').textContent = 'Copiado'; break;
      case 'cfgload': try { var nc = JSON.parse($('#cfgJson').value); if (!nc.teams || !nc.challenges || !nc.plan) throw 0; commit(function (s) { s.cfg = mergeCfg(DEFAULT_CONFIG, nc); }, { cfg: true }); alert('Configuración aplicada.'); } catch (e) { alert('El texto no es una configuración válida.'); } break;
      case 'cfgreset': arm('cfgreset', function () { try { localStorage.removeItem(STORE_CFG); } catch (e) {} commit(function (s) { s.cfg = clone(DEFAULT_CONFIG); }, { cfg: true }); }); break;
      case 'role': App.chooseRole(null); break;
      case 'demo': App.demo(); break;
    }
  }
  function change(c, v, el) {
    if (c === 'pick' || c === 'verse') { if (!drawer) return; } else if (locked()) return;
    var val = el.value;
    commit(function (s) {
      var cfg = s.cfg, i;
      switch (c) {
        case 'pick': cfg.plan[s.round].picks[+v] = val; if (s.scene === 'timer' || s.scene === 'brief') T.readyTimer(s); break;
        case 'ppick': var rt = v.split('-'); cfg.plan[+rt[0]].picks[+rt[1]] = val; break;
        case 'ptitle': cfg.plan[+v].title = val; break;
        case 'pverse': cfg.plan[+v].verse = val; break;
        case 'wlabel': cfg.wheel.slices[+v].label = val || 'Parte'; break;
        case 'wact': cfg.wheel.slices[+v].action = val; break;
        case 'wref': cfg.wheel.slices[+v].verse.ref = val; break;
        case 'wtext': cfg.wheel.slices[+v].verse.text = val; break;
        case 'pausaq': cfg.pause.question = val; break;
        case 'pausas': cfg.pause.secs = Math.max(10, Math.min(180, parseInt(val, 10) || 60)); break;
        case 'verse': s.verse = val; break;
        case 'ctitle': cfg.challenges[+v].title = val || 'Reto'; break;
        case 'cdisc': cfg.challenges[+v].disc = val; break;
        case 'csecs': cfg.challenges[+v].secs = Math.max(5, Math.min(180, parseInt(val, 10) || 30)); if ((s.scene === 'timer' || s.scene === 'brief') && !s.timer.running) T.readyTimer(s); break;
        case 'ctext': cfg.challenges[+v].text = val; break;
        case 'tname': cfg.teams[+v].name = val || ('Equipo ' + (+v + 1)); break;
        case 'tcolor': cfg.teams[+v].color = val; break;
        case 'perm': cfg.perMission = (+val === 2 && cfg.rounds <= 4) ? 2 : 1; break;
        case 'rounds': cfg.rounds = Math.max(2, Math.min(8, +val || 6)); if (cfg.rounds * pm(cfg) > 8) cfg.perMission = 1;
          while (cfg.plan.length < cfg.rounds) cfg.plan.push(newPlanRound(cfg, cfg.plan.length)); cfg.wheel.after = wheelAfterFor(cfg.rounds); s.round = Math.min(s.round, cfg.rounds - 1);
          Object.keys(s.done).forEach(function (id) { if (+id.split('-')[0] >= cfg.rounds) delete s.done[id]; }); s.order = s.order.filter(function (id) { return s.done[id]; }); break;
        case 'txt': cfg[v] = val; break;
        case 'vref': cfg.verses[v].ref = val; break;
        case 'vtext': cfg.verses[v].text = val; break;
        case 'cred': cfg.credits[v] = val; break;
        case 'snd': cfg.sounds[v] = val.trim(); break;
      }
    }, { cfg: c !== 'verse', quiet: /^(INPUT|TEXTAREA)$/.test(el.tagName) && el.type !== 'color' });
    if (/^(INPUT|TEXTAREA)$/.test(el.tagName) && el.type !== 'color') softRender();
  }

  function start() {
    document.body.classList.add('mode-control');
    root = $('#control');
    var cached = Sync.cached();
    S = cached && cached.cfg ? cached : freshState(loadConfig());
    if (!S.hist) S.hist = [];
    lastSig = S.scene + '|' + S.round;
    Sync.onState(function (st, src) {
      if (src === 'hello') { Sync.publish(S); return; }
      if (src === 'server' && (!st || st.rev < S.rev)) { Sync.publish(S); return; }  // el celular tiene lo más reciente
      if (st && st.cfg && st.rev > S.rev) { S = st; if (!S.hist) S.hist = []; var sg = S.scene + '|' + S.round; if (sg !== lastSig) { drawer = false; lastSig = sg; } saveCfg(); render(); }
    });
    Sync.onStatus(function (st) {
      if (st === 'pin' && !pinAsked) { pinAsked = true; setTimeout(function () { var p = prompt('PIN del presentador (aparece en la ventana del servidor):'); pinAsked = false; if (p) { Sync.setPin(p); Sync.publish(S); } }, 50); }
      render();
    });
    root.addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (b) { Sound.unlock(); act(b.dataset.a, b.dataset.v, b); } });
    root.addEventListener('change', function (e) { var el = e.target.closest('[data-c]'); if (el) change(el.dataset.c, el.dataset.v, el); });
    root.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-hold]'); if (!b) return;
      b.classList.add('holding'); clearTimeout(holdT);
      holdT = setTimeout(function () { drawer = true; render(); }, 1500);
    });
    var holdEnd = function () { clearTimeout(holdT); var hb = $('.hold.holding', root); if (hb) hb.classList.remove('holding'); };
    document.addEventListener('pointerup', holdEnd); document.addEventListener('pointercancel', holdEnd);
    root.addEventListener('contextmenu', function (e) { if (e.target.closest('[data-hold]')) e.preventDefault(); });
    setInterval(function () {
      var el = $('#ctime'); if (!el || !S) return;
      var l = timerLeft(S.timer); el.textContent = S.timer.running || l > 0 ? Math.ceil(l / 1000) : '¡Tiempo!';
      el.classList.toggle('run', S.timer.running);
    }, 200);
    render();
    Sync.publish(S); // anuncia el estado actual a la pantalla
  }
  return { start: start, state: function () { return S; } };
})();

/* =====================================================================
   DEMOSTRACIÓN (recorrido automático, no afecta al culto en vivo)
   ===================================================================== */
var Demo = (function () {
  var s, steps, i, tmr;
  function push() { s.rev++; s.at = nowMs(); Screen.apply(clone(s)); }
  function build() {
    var q = [];
    q.push([0, function () { T.go(s, 'intro'); }], [11500, function () { T.go(s, 'teams'); }]);
    for (var r = 0; r < s.cfg.rounds; r++) (function (r) {
      q.push([5000, function () { s.round = r; T.readyTimer(s); T.go(s, 'brief'); }],
             [5500, function () { T.readyTimer(s); s.timer.dur = 6; s.timer.left = 6000; T.go(s, 'timer'); }],
             [1200, function () { T.startTimer(s); }],
             [7200, function () { T.mark(s, 0, true); }], [900, function () { T.mark(s, 1, true); }], [900, function () { T.mark(s, 2, true); }],
             [2600, function () { T.go(s, 'progress'); }]);
      if (r < s.cfg.rounds - 1 && (s.cfg.wheel.after || []).indexOf(r) >= 0)
        q.push([3500, function () { T.go(s, 'wheel', T.wheelReset(s)); }], [2500, function () { T.spin(s); }], [9000, function () {}]);
    })(r);
    q.push([4000, function () { T.go(s, 'pause'); }], [9000, function () { T.go(s, 'finale', { seg: 0 }); }], [44000, function () { s.seg = 1; s.key++; }],
           [21000, function () { s.seg = 2; s.key++; }], [7000, function () { s.seg = 3; s.key++; }], [7000, function () { s.seg = 4; s.key++; }], [9000, function () { T.go(s, 'safe'); }]);
    return q;
  }
  function run() {
    if (i >= steps.length) return;
    var st = steps[i++]; tmr = setTimeout(function () { st[1](); push(); run(); }, st[0]);
  }
  return {
    start: function () {
      s = freshState(loadConfig()); s.rev = 0; steps = build(); i = 0;
      Screen.apply(clone(s)); run();
    },
    stop: function () { clearTimeout(tmr); }
  };
})();

/* =====================================================================
   ARRANQUE: selección de modo
   ===================================================================== */
var App = (function () {
  var ROLE = 'ponlo.role';
  function show(id) { ['landing', 'stageWrap', 'control'].forEach(function (x) { $('#' + x).hidden = x !== id; }); }
  function cloudMode() { return !Sync.info() && Room.available(); }
  function landing() {
    show('landing'); $('#joinBox').hidden = true;
    var s = Sync.status(), info = Sync.info();
    if (info && info.ips && info.ips.length) {
      $('#landNote').innerHTML = 'Servidor conectado. En este computador elige <b>PANTALLA</b>. En el celular del presentador (mismo WiFi) abre ' +
        info.ips.map(function (ip) { return '<b>http://' + ip + ':' + info.port + '</b>'; }).join(' o ') + ' y elige <b>CONTROL</b>.';
      return;
    }
    $('#landNote').textContent = s === 'cloud' || s === 'connecting'
      ? 'En línea: abre este mismo enlace en el celular (Control) y en el computador del proyector (Pantalla).'
      : 'Modo local: abre Pantalla y Control en dos ventanas de este mismo computador. Para usar el celular, abre la versión publicada (enlace).';
    Sync.whenDetected(function () {
      if (cloudMode()) $('#landNote').innerHTML = 'Conexión por código: en el computador del proyector elige <b>PANTALLA</b> (mostrará un código y un QR). En el celular del presentador escanea el QR con la cámara, o elige <b>CONTROL</b> y pega el código.';
    });
  }
  function showJoin(msg) { show('landing'); $('#joinBox').hidden = false; $('#joinErr').textContent = msg || ''; }
  function startRoom(role) {
    if (!cloudMode()) return;
    var c = role === 'screen' ? Room.ensureCode() : Room.savedCode();
    if (!c) return;
    Room.setStateGetter(role === 'screen' ? Screen.state : Control.state);
    if (role === 'screen') Pairing.init();
    Room.start(role, c).then(function () { if (role === 'screen' && !Room.wasPaired()) Pairing.show(true); });
  }
  function go(role) {
    Sound.unlock();
    if (role === 'screen') { show('stageWrap'); Screen.start(); var d = document.documentElement; if (d.requestFullscreen && !document.fullscreenElement) d.requestFullscreen().catch(function () {}); }
    else { show('control'); Control.start(); }
    startRoom(role);
  }
  function enter(role) {
    try { localStorage.setItem(ROLE, role); } catch (e) {}
    Sync.whenDetected(function () {
      if (role === 'control' && cloudMode() && !Room.savedCode()) { showJoin(); return; }
      go(role);
    });
  }
  function joinSubmit() {
    var c = Room.parse($('#joinCode').value);
    if (!c) { $('#joinErr').textContent = 'Código no válido: son 12 letras y números (sin O ni I).'; return; }
    Room.saveCode(c); enter('control');
  }
  return {
    init: function () {
      Sync.init();
      Sync.onStatus(function () { if (!$('#landing').hidden && $('#joinBox').hidden) landing(); });
      // Enlace del QR: …/#c=CÓDIGO (el código viaja en el fragmento y no llega a ningún servidor)
      var hm = /[#&]c=([A-Za-z0-9-]+)/.exec(location.hash);
      if (hm) {
        var hc = Room.parse(hm[1]);
        if (hc) { Room.saveCode(hc); try { localStorage.setItem(ROLE, 'control'); } catch (e) {} }
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      }
      document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-role]'); if (!b) return;
        var r = b.dataset.role;
        if (r === 'demo') return App.demo();
        enter(r);
      });
      $('#joinGo').addEventListener('click', joinSubmit);
      $('#joinCode').addEventListener('keydown', function (e) { if (e.key === 'Enter') joinSubmit(); });
      $('#joinPaste').addEventListener('click', function () {
        if (!navigator.clipboard || !navigator.clipboard.readText) { $('#joinErr').textContent = 'Mantén presionado el cuadro y elige Pegar.'; return; }
        navigator.clipboard.readText().then(function (t) { $('#joinCode').value = t; joinSubmit(); })
          .catch(function () { $('#joinErr').textContent = 'No se pudo leer el portapapeles: mantén presionado el cuadro y elige Pegar.'; });
      });
      document.addEventListener('pointerdown', function () { Sound.unlock(); }, { once: true });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'm' || e.key === 'M') && document.body.classList.contains('mode-screen')) App.chooseRole(null);
        if (e.key === 'Escape' && document.body.classList.contains('mode-demo')) App.chooseRole(null);
      });
      var saved = null; try { saved = localStorage.getItem(ROLE); } catch (e) {}
      if (saved === 'screen' || saved === 'control') enter(saved); else landing();
    },
    chooseRole: function () { try { localStorage.removeItem(ROLE); } catch (e) {} location.reload(); },
    demo: function () {
      document.body.classList.add('mode-demo');
      show('stageWrap'); $('#demoExit').hidden = false;
      var stg = $('#stage'); stg.innerHTML = '';
      document.body.classList.add('mode-screen');
      Screen.attach(true); Demo.start(); // la demostración alimenta la pantalla sin tocar el estado en vivo
    }
  };
})();
document.addEventListener('DOMContentLoaded', App.init);
