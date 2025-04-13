// proxy.js

const http = require('http');
const httpProxy = require('http-proxy');
const config = require('./config.json');
const { URL } = require('url');

function validateConfig(config) {
  try {
    new URL(config.target);
    return true;
  } catch (err) {
    console.error('Invalid target URL in config:', err.message);
    return false;
  }
}

if (!validateConfig(config)) {
  console.error('Configuration is invalid. Proxy will not start.');
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  proxy.web(req, res, {
    target: config.target,
    changeOrigin: true
  }, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error occurred.');
  });
});

const port = config.port || 3000;
server.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
