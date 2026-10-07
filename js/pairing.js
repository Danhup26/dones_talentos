/* =====================================================================
   VENTANA DE CONEXIÓN (solo en la pantalla): QR + código, y gestión del celular.
   · Sin celular conectado: muestra el QR y el código.
   · Con celular conectado: muestra el estado, "Cambiar de celular" y "Desvincular…".
   Se abre con la tecla P o con el engranaje (aparece al mover el mouse). Nunca se abre sola
   cuando el celular se desconecta, para no tapar la pantalla durante el culto.
   ===================================================================== */
var Pairing = (function () {
  var shown = false, inited = false, confirming = false, armedWipe = false;

  function qrSvg(url) {
    try {
      var qr = qrcode(0, 'M'); qr.addData(url); qr.make();
      return qr.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
    } catch (e) { return ''; }
  }
  function render() {
    var linked = Room.isLinked();
    $('#pairLink').hidden = linked || confirming;
    $('#pairManage').hidden = !linked || confirming;
    $('#pairConfirm').hidden = !confirming;
    if (!linked && !confirming) {
      $('#pairQr').innerHTML = qrSvg(Room.url());
      $('#pairCode').textContent = Room.format();
      $('#pairUrl').textContent = location.origin + location.pathname.replace(/index\.html$/, '');
    }
    if (linked) $('#pmStatus').textContent = 'Celular conectado ✓  ·  sala ···' + Room.suffix();
    var w = $('#pmWipe'); w.classList.toggle('armed', armedWipe);
    w.innerHTML = armedWipe ? '¿Seguro? Toca otra vez para <b>borrar</b><small>Se perderá la ronda y las piezas.</small>'
      : 'Desvincular y <b>borrar</b> el progreso<small>Se perderá la ronda y las piezas. Los nombres y actividades se conservan.</small>';
  }
  function show(v) {
    shown = !!v; confirming = false; armedWipe = false;
    var el = $('#pair'); if (!el) return;
    el.hidden = !shown;
    if (shown) render();
  }
  function ask() { confirming = true; armedWipe = false; render(); }
  /* Desvincular esta pantalla: avisa al celular, olvida la sala y vuelve al menú. */
  function leave(wipe) {
    var p = wipe ? Room.wipe() : Promise.resolve();
    p.then(function () { return Room.bye(); }).then(function () { Room.leave(); App.chooseRole(); });
  }
  function init() {
    if (inited) return; inited = true;
    var gear = $('#scrGear'); if (gear) { gear.hidden = false; gear.addEventListener('click', function () { show(!shown); }); }
    setTimeout(function () { document.body.classList.add('nocursor'); }, 4000);   // el engranaje y el cursor se ocultan solos
    $('#pairHide').addEventListener('click', function () { show(false); });
    $('#pmClose').addEventListener('click', function () { show(false); });
    $('#pairNew').addEventListener('click', function () { Room.newCode().then(function () { show(true); }); });
    $('#pmChange').addEventListener('click', function () { Room.newCode().then(function () { show(true); }); });
    $('#pairUnlink').addEventListener('click', ask);
    $('#pmUnlink').addEventListener('click', ask);
    $('#pmCancel').addEventListener('click', function () { confirming = false; armedWipe = false; render(); });
    $('#pmKeep').addEventListener('click', function () { leave(false); });
    $('#pmWipe').addEventListener('click', function () { if (!armedWipe) { armedWipe = true; render(); return; } leave(true); });
    Room.onPaired(function (linked) {
      if (linked) { show(false); var p = $('#scrStatus'); if (p) { p.textContent = 'Presentador conectado ✓'; p.classList.remove('gone'); setTimeout(function () { p.classList.add('gone'); }, 5000); } }
      else if (shown) render();
    });
    document.addEventListener('keydown', function (e) {
      if (!document.body.classList.contains('mode-screen') || !Room.code()) return;
      if (e.key === 'p' || e.key === 'P') show(!shown);
      if (e.key === 'Escape' && shown) show(false);
    });
  }
  return { init: init, show: show };
})();
