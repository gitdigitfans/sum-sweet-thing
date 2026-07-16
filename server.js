const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
};

http.createServer((req, res) => {
  let filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
  let fullPath = path.join(__dirname, filePath);
  try {
    if (!fs.existsSync(fullPath)) {
      res.writeHead(404); res.end('Not Found'); return;
    }
    let ext = path.extname(filePath);
    let mime = mimeTypes[ext] || 'application/octet-stream';
    let content = fs.readFileSync(fullPath);
    res.writeHead(200, { 'Content-Type': mime + '; charset=utf-8' });
    res.end(content);
  } catch (e) {
    res.writeHead(500); res.end(e.message);
  }
}).listen(3000, () => console.log('Server running on http://localhost:3000'));
