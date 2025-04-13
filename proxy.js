// Assuming the existing proxy.js uses something like 'http' or 'https' modules
const http = require('http');
const https = require('https');
const config = require('./config.json');

const targetHost = 'example.com'; // Replace with the actual target host
const targetPort = 80;

const proxy = http.createServer((req, res) => {
  
  if (config.interceptionEnabled) {
    console.log('Intercepted Request:', req.method, req.url);
    // Log request headers as well in a more robust implementation
    console.log('Headers:', req.headers);
  }

  const options = {
    hostname: targetHost,
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error('Proxy Request Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  });

  req.on('error', (err) => {
    console.error('Request Error:', err);
  });
});

const port = 3000;
proxy.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});