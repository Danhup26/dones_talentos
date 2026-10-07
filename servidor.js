/* =====================================================================
   DONES Y TALENTOS — SERVIDOR LOCAL (sin dependencias, solo Node.js)
   Conecta el celular del presentador con la pantalla del proyector
   usando el WiFi del lugar. No necesita internet.

   Uso:   node servidor.js [puerto] [PIN]
   Ej.:   node servidor.js 3000 4821     (el PIN es opcional)
   ===================================================================== */
var http = require('http'), fs = require('fs'), path = require('path'), os = require('os');

var PORT = parseInt(process.argv[2] || process.env.PORT, 10) || 3000;
var PIN = String(process.argv[3] || process.env.PIN || '');
var ROOT = __dirname;
var FILE = path.join(ROOT, 'estado-en-vivo.json');
var PRIVATE = { 'servidor.js': 1, 'estado-en-vivo.json': 1, 'iniciar.bat': 1 };
var MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.txt': 'text/plain; charset=utf-8'
};

/* ---------- Estado en vivo (el que tenga la "rev" más alta gana) ---------- */
var raw = 'null', rev = -1, saveT = null, clients = [];
try { raw = fs.readFileSync(FILE, 'utf8'); rev = JSON.parse(raw).rev; } catch (e) { raw = 'null'; rev = -1; }

function persist() {
  clearTimeout(saveT);
  saveT = setTimeout(function () { fs.writeFile(FILE, raw, function () {}); }, 400);
}
function broadcast() {
  var msg = 'data: ' + raw + '\n\n';
  clients.forEach(function (res) { try { res.write(msg); } catch (e) {} });
}
function lanAddresses() {
  var out = [], nets = os.networkInterfaces();
  Object.keys(nets).forEach(function (k) {
    nets[k].forEach(function (n) { if (n.family === 'IPv4' && !n.internal) out.push(n.address); });
  });
  return out;
}

function send(res, code, type, body, extra) {
  var h = { 'Content-Type': type, 'Cache-Control': 'no-store' };
  if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
  res.writeHead(code, h); res.end(body);
}

function api(req, res, url) {
  if (url === '/api/time') return send(res, 200, MIME['.json'], JSON.stringify({ t: Date.now() }));
  if (url === '/api/info') return send(res, 200, MIME['.json'], JSON.stringify({ port: PORT, ips: lanAddresses(), pin: !!PIN }));
  if (url === '/api/state' && req.method === 'GET') return send(res, 200, MIME['.json'], raw);

  if (url === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'Connection': 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 1500\n\ndata: ' + raw + '\n\n');
    clients.push(res);
    var ka = setInterval(function () { try { res.write(': ping\n\n'); } catch (e) {} }, 15000);
    req.on('close', function () { clearInterval(ka); clients = clients.filter(function (c) { return c !== res; }); });
    return;
  }

  if (url === '/api/state' && req.method === 'POST') {
    if (PIN && req.headers['x-pin'] !== PIN) return send(res, 401, MIME['.json'], '{"error":"pin"}');
    var body = '';
    req.on('data', function (c) { body += c; if (body.length > 2e6) req.destroy(); });
    req.on('end', function () {
      var st;
      try { st = JSON.parse(body); } catch (e) { return send(res, 400, MIME['.json'], '{"error":"json"}'); }
      if (!st || typeof st.rev !== 'number' || !st.cfg) return send(res, 400, MIME['.json'], '{"error":"estado"}');
      if (st.rev < rev) return send(res, 409, MIME['.json'], raw);
      raw = JSON.stringify(st); rev = st.rev;
      persist(); broadcast();
      send(res, 204, MIME['.json'], '');
    });
    return;
  }
  send(res, 404, MIME['.json'], '{"error":"no existe"}');
}

/* ---------- Archivos estáticos ---------- */
function serve(req, res, url) {
  var rel;
  try { rel = decodeURIComponent(url); } catch (e) { return send(res, 400, 'text/plain', 'Solicitud inválida'); }
  if (rel === '/') rel = '/index.html';
  var file = path.resolve(ROOT, '.' + rel);
  if (file.indexOf(ROOT + path.sep) !== 0 || PRIVATE[path.basename(file).toLowerCase()]) return send(res, 403, 'text/plain', 'No permitido');
  fs.readFile(file, function (err, data) {
    if (err) return send(res, 404, 'text/plain; charset=utf-8', 'No encontrado');
    send(res, 200, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', data);
  });
}

var server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0];
  if (url.indexOf('/api/') === 0) return api(req, res, url);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'text/plain', 'Método no permitido');
  serve(req, res, url);
});

server.on('error', function (e) {
  if (e.code === 'EADDRINUSE') console.log('\n  El puerto ' + PORT + ' ya está en uso. Cierra la otra ventana del servidor o usa otro puerto:\n  node servidor.js 3001\n');
  else console.log(e);
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', function () {
  var ips = lanAddresses();
  console.log('\n  DONES Y TALENTOS · servidor listo\n');
  console.log('  1) En ESTE computador (proyector):  http://localhost:' + PORT + '   → elige PANTALLA');
  if (ips.length) ips.forEach(function (ip) { console.log('  2) En el CELULAR del presentador:    http://' + ip + ':' + PORT + '   → elige CONTROL'); });
  else console.log('  2) No se encontró red WiFi. Conecta el computador y el celular a la misma red.');
  if (PIN) console.log('\n  PIN del presentador: ' + PIN);
  console.log('\n  El celular y el computador deben estar en la misma red WiFi (o el celular en el hotspot del computador).');
  console.log('  Deja esta ventana abierta durante el culto. Para cerrar: Ctrl + C\n');
});
