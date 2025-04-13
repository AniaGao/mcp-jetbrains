// proxy.js

const http = require('http');
const https = require('https');
const url = require('url');

// Function to handle proxy requests
const handleProxyRequest = (req, res) => {
  try {
    const targetURL = req.headers['x-target-url'];

    if (!targetURL) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing x-target-url header');
      return;
    }

    const parsedURL = url.parse(targetURL);
    const options = {
      hostname: parsedURL.hostname,
      port: parsedURL.port || (parsedURL.protocol === 'https:' ? 443 : 80),
      path: parsedURL.path,
      method: req.method,
      headers: req.headers,
    };

    // Remove the x-target-url header so it's not sent to the target server
    delete options.headers['x-target-url'];

    const protocol = parsedURL.protocol === 'https:' ? https : http;

    const proxyReq = protocol.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy Error');
    });

    req.pipe(proxyReq, { end: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  }
};

// Create HTTP server
const server = http.createServer(handleProxyRequest);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
