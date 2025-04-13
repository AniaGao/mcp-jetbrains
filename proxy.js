// proxy.js

const http = require('http');
const https = require('https');
const url = require('url');

// Middleware to log incoming requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const headers = req.headers;

  console.log(`[${timestamp}] ${method} ${url}`);
  console.log("Headers:", headers);
  next(); // Pass control to the next middleware or route handler
};

const server = http.createServer((req, res) => {
  requestLogger(req, res, () => {
    // Log the request

    const target = url.parse(req.url);
    const options = {
        hostname: target.hostname,
        port: target.port || 80,
        path: target.path,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
        console.error('Proxy request error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
    });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});