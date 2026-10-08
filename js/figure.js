/* =====================================================================
   SILUETA + ROMPECABEZAS (SVG)
   La figura representa a la iglesia como cuerpo (1 Co 12:12-27).
   Cuadrícula: 3 columnas (una por fila/equipo) × N rondas.
   ===================================================================== */
var Figure = (function () {
  var W = 300, H = 600;

  /* Silueta humana de frente (vectorizada de una imagen aportada), ajustada al área 300×600. */
  var BODY = '<path d="M 142.5 21.9 C 131.5 25.4, 125 35.9, 125 49.8 C 125 53, 124.5 56, 123.9 56.3 C 120.9 58.2, 123 68.3, 127.3 73.1 C 132.3 78.5, 134.8 98.1, 131 101.9 C 128.3 104.6, 115.9 110.5, 103.3 115.2 C 75.8 125.5, 74.1 127.9, 72.7 156.4 C 72.2 166.2, 71.1 178.2, 70.1 183.1 C 69.2 188, 68.3 195.5, 68.2 199.7 C 68 205, 67.1 209.1, 65.4 212.5 C 61.6 220.4, 60.6 224.9, 57.7 249.2 C 53.2 285.8, 52.1 291, 47.2 296.4 C 39.1 305.3, 27.2 326.2, 29.4 327.6 C 31 328.6, 34.4 326.3, 38.2 321.8 C 42.2 316.9, 42.1 316.5, 39.9 333.3 C 38.1 347, 38.3 349.2, 41 349.2 C 42.7 349.2, 43 348.1, 46.5 333.7 L 48.2 326.5 47.5 336.5 C 46.6 351.4, 46.7 352.3, 49.9 351.1 C 50.8 350.7, 52 348.3, 52.4 345.7 L 53.3 340.9 53.8 345.9 C 54.2 349.3, 55 351, 56.2 351.2 C 58.6 351.7, 59.3 349.6, 60.3 339.3 L 61.1 330.9 61.6 337.6 C 62 342.5, 62.6 344.3, 64 344.6 C 66.9 345.1, 67.4 341.3, 67.8 315.2 C 68.2 287.6, 68.6 286, 77.9 265.5 C 85.4 249, 89.1 236.7, 90.4 223.4 C 91.6 211.6, 98.1 180.3, 99.4 180.3 C 100.1 180.3, 101.1 185, 105.1 208.1 C 107.8 223.7, 106.7 242.4, 101.7 268.1 C 96.9 292.3, 95.6 306.8, 96.5 328.3 C 97.4 351, 100 378.3, 102.3 388.3 C 104.1 396, 104 398.5, 102.1 450.9 C 101.4 470, 101.4 470.9, 108.9 517.8 C 113.6 547.7, 112.8 556.7, 104.4 566 C 99.1 571.9, 93.9 579.6, 93.9 581.6 C 93.9 587.1, 106.9 593.9, 111 590.5 C 112.1 589.6, 112.7 589.7, 113.2 591 C 114 593.2, 118.3 593.1, 121.4 590.9 C 124.7 588.6, 126.7 584.6, 128.3 576.8 C 129 573.3, 130.4 568.9, 131.3 567 C 132.6 564.4, 132.8 562.1, 132.2 557.3 C 129.4 536.2, 129.7 520.3, 133.5 499.3 C 136.2 484, 136.5 479, 136.8 454.3 C 137.1 420.2, 137.6 412.3, 141.7 384.8 C 145.1 361.2, 148.2 333.1, 148.6 321 C 149.1 308.4, 151.3 310.6, 152.2 324.5 C 153.1 339.5, 156.6 370.1, 159.5 387.6 C 162.8 408.5, 164.2 431.3, 163.5 451.4 C 162.8 470, 163.7 479.5, 168.9 508.2 C 170.9 519.5, 171 528, 169.3 548.5 C 168.2 561.9, 168.3 564.4, 169.8 568 C 170.8 570.3, 172.2 575.1, 172.9 578.8 C 175.1 589.2, 182.9 595.7, 187.6 591 C 188.8 589.8, 189.5 589.7, 190.1 590.6 C 191.5 592.9, 199.4 590.6, 203.7 586.6 C 208.5 582, 208.4 581.5, 198 567.8 C 194 562.7, 190.5 557, 190.2 555.3 C 188.4 546.1, 188.3 538.1, 189.9 529.2 C 199.2 476.1, 200.1 463.8, 197.5 421.7 C 196.3 400.9, 196.3 398.4, 198.3 388.4 C 205.6 350.6, 206 302.6, 199.4 270.4 C 192.9 238.6, 192.5 221.8, 197.9 194.9 C 201.4 177.2, 201.4 177.2, 205.1 194.1 C 208.7 209.9, 209.5 214.6, 210.5 225.4 C 211.6 236.8, 215.6 249.8, 223.4 267.1 C 231.5 285, 234.1 294.7, 232.7 301.8 C 231.6 307.8, 233 338.9, 234.5 342.8 C 234.9 343.9, 236 344.8, 236.8 344.8 C 238.6 344.8, 238.8 343.7, 238.6 334.2 C 238.5 328.1, 238.6 328.4, 240 337.8 C 241.7 349.9, 242.2 351.5, 244.4 351.5 C 245.8 351.5, 246.2 349.8, 246.3 342.8 L 246.4 334.2 247.4 340.6 C 248.5 348.2, 250 351.5, 252.5 351.5 C 254.3 351.5, 254.3 351.2, 252.3 330.9 L 251.7 325.3 253.3 330.3 C 254.1 333.1, 255.5 338.3, 256.3 342 C 257.4 347, 258.4 348.8, 259.9 349.1 C 262.2 349.5, 262.2 349.4, 259.9 324.2 L 259.3 317.6 261.6 320.9 C 265.6 326.7, 271.7 330.2, 271.7 326.6 C 271.7 322.4, 257.5 299.7, 252.7 296.2 C 249.2 293.6, 247 283, 242.8 247.3 C 240.7 229.2, 237.7 216, 234.5 210.9 C 233.7 209.7, 232.8 203.6, 232.4 197.5 C 232 191.4, 231.1 184.4, 230.5 182 C 229.9 179.5, 228.9 169.3, 228.4 159.2 C 226.7 128.5, 224.3 125.2, 197.2 115.2 C 186.9 111.4, 171 103.8, 169.4 101.9 C 166.5 98.4, 169.6 73.6, 172.9 73.6 C 176.2 73.6, 180 57.5, 177 56.3 C 176.1 56, 175.5 53, 175.3 48 C 174.7 28.2, 159.9 16.4, 142.5 21.9"/>';

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
