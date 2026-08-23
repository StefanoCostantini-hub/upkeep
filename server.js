// Upkeep — shared backend
// No external dependencies. Serves the app and stores team-shared data
// in data.json next to this file. Run with: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'data.json');
const APP_FILE = path.join(__dirname, 'maintenance-tracker.html');
const DEFAULT_DATA = '{"tasks":[],"log":[],"buildingName":"123 Main St"}';

function readData() {
  try {
    return fs.readFileSync(DATA_FILE, 'utf8');
  } catch (e) {
    return DEFAULT_DATA;
  }
}

function writeData(json) {
  // write to a temp file then rename, so a crash mid-write can't corrupt data.json
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, json, 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(readData());
    return;
  }

  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        JSON.parse(body); // validate it's real JSON before saving
        writeData(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"ok":false,"error":"invalid json"}');
      }
    });
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile(APP_FILE, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Could not load app file (maintenance-tracker.html missing next to server.js)');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Upkeep is running at http://localhost:${PORT}`);
});
