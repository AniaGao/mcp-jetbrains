// Import necessary modules (assuming http and http-proxy are used)
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Response Logging Middleware
const responseLoggingMiddleware = (req, res, proxyRes) => {
  const now = new Date();
  const timestamp = now.toISOString();
  const url = req.url;
  const statusCode = proxyRes.statusCode;
  const headers = proxyRes.headers;

  console.log(`[${timestamp}] Response: ${url} - Status: ${statusCode}`);
  console.log('Headers:', headers);
};

// Create a server that listens for requests
const server = http.createServer(function(req, res) {
  // Define the target URL (where to forward the requests - change as needed)
  const target = 'http://localhost:3000'; // Example target

  // Listen for the 'proxyRes' event (response from the target server)
  proxy.on('proxyRes', (proxyRes, req, res) => {
    responseLoggingMiddleware(req, res, proxyRes);
  });

  // Handle proxy errors
  proxy.on('error', function (err, req, res) {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy Error');
  });

  // Forward the request to the target
  proxy.web(req, res, { target: target });
});

// Start the server
const port = 8000; // Or read from config
server.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});