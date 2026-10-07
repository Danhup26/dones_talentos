/* =====================================================================
   SILUETA + ROMPECABEZAS (SVG)
   La figura representa a la iglesia como cuerpo (1 Co 12:12-27).
   Cuadrícula: 3 columnas (una por fila/equipo) × N rondas.
   ===================================================================== */
var Figure = (function () {
  var W = 300, H = 600;

  /* Silueta estilizada, proporciones de ~8 cabezas, postura con leve contrapposto
     y un brazo que se abre hacia adelante (gesto de dar / servir). */
  var BODY = [
    // Cabeza y cuello
    '<ellipse cx="150" cy="52" rx="25.5" ry="32" transform="rotate(-4 150 52)"/>',
    '<path d="M139 76 C140 92 138 102 133 114 L167 114 C162 102 160 92 161 76 Z"/>',
    // Torso
    '<path d="M150 108 C175 108 197 112 210 122 C222 131 223 148 219 166 C213 194 201 214 195 236 C191 253 196 271 203 294 L97 294 C104 271 109 253 105 236 C99 214 87 194 81 166 C77 148 78 131 90 122 C103 112 125 108 150 108 Z"/>',
    // Pierna de apoyo (izquierda en pantalla)
    '<path d="M97 286 C92 336 97 386 103 420 C108 452 104 500 107 542 C108 560 110 574 110 584 C104 589 104 596 112 597 C124 599 140 598 146 593 C148 589 143 584 141 576 C139 556 139 532 140 508 C142 476 146 448 147 420 C149 380 151 336 152 296 Z"/>',
    // Pierna relajada (derecha en pantalla), ligeramente abierta
    '<path d="M148 296 C150 338 154 382 158 420 C161 450 166 478 168 508 C170 532 171 556 170 576 C169 586 166 592 172 595 C182 599 202 598 210 593 C214 589 210 585 205 581 C202 572 202 558 203 542 C206 500 206 452 205 420 C206 384 207 338 203 286 Z"/>',
    // Brazo relajado (izquierda en pantalla)
    '<path d="M92 122 C77 128 70 146 69 168 C67 200 64 232 62 260 C60 282 59 300 60 318 C56 330 54 346 58 357 C62 364 70 361 72 352 C76 340 76 328 74 318 C78 296 82 276 87 256 C91 232 97 206 101 186 Z"/>',
    // Brazo que se abre hacia adelante con la mano abierta
    '<path d="M208 122 C224 128 232 146 235 166 C239 194 247 222 254 248 C260 270 266 288 271 304 C279 311 286 323 287 337 C288 349 280 354 273 348 C266 340 261 327 258 315 C250 296 240 276 232 254 C224 232 218 208 214 186 Z"/>'
  ].join('');

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function edge(ax, ay, bx, by, nx, ny, sign, L) {
    if (!sign) return ' L' + bx + ' ' + by;
    function P(t, h) { return (ax + (bx - ax) * t + nx * sign * h * L).toFixed(1) + ' ' + (ay + (by - ay) * t + ny * sign * h * L).toFixed(1); }
    return ' L' + P(.36, 0) + ' C' + P(.43, 0) + ' ' + P(.29, .25) + ' ' + P(.5, .25) +
           ' C' + P(.71, .25) + ' ' + P(.57, 0) + ' ' + P(.64, 0) + ' L' + bx + ' ' + by;
  }

  var cache = {};
  function pieces(rows) {
    if (cache[rows]) return cache[rows];
    var cw = W / 3, ch = H / rows, L = Math.min(cw, ch), R = rng(12 + rows), h = [], v = [], out = [];
    for (var r = 0; r <= rows; r++) { h[r] = []; v[r] = []; for (var c = 0; c <= 3; c++) { h[r][c] = R() < .5 ? 1 : -1; v[r][c] = R() < .5 ? 1 : -1; } }
    for (r = 0; r < rows; r++) for (c = 0; c < 3; c++) {
      var x0 = c * cw, y0 = r * ch, x1 = x0 + cw, y1 = y0 + ch;
      var d = 'M' + x0 + ' ' + y0 +
        edge(x0, y0, x1, y0, 0, 1, r > 0 ? h[r][c] : 0, L) +
        edge(x1, y0, x1, y1, 1, 0, c < 2 ? v[r][c + 1] : 0, L) +
        edge(x1, y1, x0, y1, 0, 1, r < rows - 1 ? h[r + 1][c] : 0, L) +
        edge(x0, y1, x0, y0, 1, 0, c > 0 ? v[r][c] : 0, L) + ' Z';
      out.push({ id: r + '-' + c, r: r, t: c, d: d, cx: x0 + cw / 2, cy: y0 + ch / 2, x0: x0, y0: y0, x1: x1, y1: y1 });
    }
    return (cache[rows] = out);
  }

  var uidN = 0;
  /* opts: rows, colors[3], have{} (piezas obtenidas), mode: 'progress' | 'assembly' */
  function board(opts) {
    var u = 'f' + (++uidN) + '_', ps = pieces(opts.rows), defs = '', groups = '';
    defs += '<g id="' + u + 'body">' + BODY + '</g>';
    defs += '<clipPath id="' + u + 'bc"><use href="#' + u + 'body"/></clipPath>';
    defs += '<linearGradient id="' + u + 'gold" gradientUnits="userSpaceOnUse" x1="70" y1="20" x2="250" y2="600"><stop offset="0" stop-color="#FFF7E0"/><stop offset=".45" stop-color="#F6CF77"/><stop offset="1" stop-color="#C98F1C"/></linearGradient>';
    defs += '<linearGradient id="' + u + 'sweep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>';
    defs += '<linearGradient id="' + u + 'shade" gradientUnits="userSpaceOnUse" x1="58" y1="0" x2="290" y2="90"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#3a1d00" stop-opacity="0"/><stop offset="1" stop-color="#3a1d00" stop-opacity=".38"/></linearGradient>';
    defs += '<filter id="' + u + 'glow" x="-30%" y="-15%" width="160%" height="130%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
    ps.forEach(function (p) {
      defs += '<clipPath id="' + u + 'c' + p.id + '"><path d="' + p.d + '"/></clipPath>';
      var have = !opts.have || opts.have[p.id];
      groups += '<g class="pc' + (have ? ' have' : ' miss') + '" data-id="' + p.id + '" style="--tc:' + (opts.colors[p.t] || '#fff') + '">' +
        '<path class="glass" d="' + p.d + '"/>' +
        '<g clip-path="url(#' + u + 'c' + p.id + ')"><use href="#' + u + 'body" class="flesh" fill="url(#' + u + 'gold)"/></g>' +
        '<path class="seam" d="' + p.d + '"/></g>';
    });
    return '<svg class="board mode-' + (opts.mode || 'progress') + '" viewBox="-40 -30 380 660" role="img" aria-label="Rompecabezas: una silueta humana formada por muchas piezas">' +
      '<defs>' + defs + '</defs>' +
      '<use href="#' + u + 'body" class="whole" fill="url(#' + u + 'gold)" filter="url(#' + u + 'glow)"/>' +
      '<g class="pieces">' + groups + '</g>' +
      '<use href="#' + u + 'body" class="shade" fill="url(#' + u + 'shade)"/>' +
      '<g class="sweepwrap" clip-path="url(#' + u + 'bc)"><rect class="sweep" x="-20" y="-200" width="340" height="180" fill="url(#' + u + 'sweep)"/></g>' +
      '</svg>';
  }

  /* Una sola pieza, grande, sin revelar la figura (para "misión completada") */
  function single(rows, id, color) {
    var p = pieces(rows).filter(function (x) { return x.id === id; })[0]; if (!p) return '';
    var m = Math.min(W / 3, H / rows) * .32;
    var vb = (p.x0 - m) + ' ' + (p.y0 - m) + ' ' + (p.x1 - p.x0 + 2 * m) + ' ' + (p.y1 - p.y0 + 2 * m);
    return '<svg class="solo" viewBox="' + vb + '" style="--tc:' + color + '" aria-hidden="true"><path class="glass" d="' + p.d + '"/><path class="seam" d="' + p.d + '"/></svg>';
  }

  return { board: board, single: single, pieces: pieces };
})();
