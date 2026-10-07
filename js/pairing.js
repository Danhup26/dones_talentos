/* =====================================================================
   VENTANA DE EMPAREJAMIENTO (solo en la pantalla): código + QR
   Se muestra hasta que el celular se conecta y luego se oculta. Tecla P: mostrarla/ocultarla.
   ===================================================================== */
var Pairing = (function () {
  var shown = false, inited = false;

  function qrSvg(url) {
    try {
      var qr = qrcode(0, 'M'); qr.addData(url); qr.make();
      return qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    } catch (e) { return ''; }
  }
  function render() {
    var url = Room.url();
    $('#pairQr').innerHTML = qrSvg(url);
    $('#pairCode').textContent = Room.format();
    $('#pairUrl').textContent = location.origin + location.pathname.replace(/index\.html$/, '');
  }
  function show(v) {
    shown = !!v;
    var el = $('#pair'); if (!el) return;
    el.hidden = !shown;
    if (shown) render();
  }
  function init() {
    if (inited) return; inited = true;
    $('#pairHide').addEventListener('click', function () { show(false); });
    $('#pairNew').addEventListener('click', function () { Room.newCode().then(function () { show(true); }); });
    Room.onPaired(function (linked) {
      if (linked) { show(false); var p = $('#scrStatus'); if (p) { p.textContent = 'Presentador conectado ✓'; p.classList.remove('gone'); setTimeout(function () { p.classList.add('gone'); }, 5000); } }
    });
    document.addEventListener('keydown', function (e) {
      if (!document.body.classList.contains('mode-screen') || !Room.code()) return;
      if (e.key === 'p' || e.key === 'P') show(!shown);
    });
  }
  return { init: init, show: show };
})();
