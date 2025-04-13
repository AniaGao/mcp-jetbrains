const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const port = 3000;
const target = process.env.TARGET_URL || 'http://localhost:8080'; // Default target URL

const proxy = httpProxy.createProxyServer({
  target: target,
  changeOrigin: true, // Required for some APIs to work correctly
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('Proxy error');
});

// Forward all requests to the target
app.all('*', (req, res) => {
  proxy.web(req, res, { target: target });
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
  console.log(`Forwarding to target: ${target}`);
});