// proxy.js
const http = require('http');
const https = require('https');
const fs = require('fs');

let targetUrl;

try {
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  targetUrl = config.targetUrl;
} catch (error) {
  targetUrl = process.env.TARGET_URL;
  if (!targetUrl) {
    console.warn('Target URL not found in config.json or TARGET_URL environment variable. Defaulting to http://localhost:8080');
    targetUrl = 'http://localhost:8080';
  }
}

const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);

  const options = {
    hostname: new URL(targetUrl).hostname,
    port: new URL(targetUrl).port || (new URL(targetUrl).protocol === 'https:' ? 443 : 80),
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const protocol = targetUrl.startsWith('https') ? https : http;
  const proxyReq = protocol.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error("Proxy request error:", err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  });

  req.on('error', (err) => {
    console.error("Request error:", err);
    proxyReq.destroy(err);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Proxy server listening on port ${port} and forwarding to ${targetUrl}`);
});