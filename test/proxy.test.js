// test/proxy.test.js
const request = require('supertest');
const http = require('http');
const proxy = require('../proxy'); // Assuming your proxy.js exports the app or server

// Mock target server
let targetServer;
let targetServerPort;

beforeAll((done) => {
  targetServer = http.createServer((req, res) => {
    if (req.url === '/test') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Hello from target!' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  targetServer.listen(0, () => { // Listen on a random available port
    targetServerPort = targetServer.address().port;
    done();
  });
});

afterAll((done) => {
    targetServer.close(done);
});


describe('Proxy Functionality', () => {
    let proxyServer;
    let proxyServerPort;

    beforeAll((done) => {
        // Override the target URL with the mock server's URL
        process.env.TARGET_URL = `http://localhost:${targetServerPort}`;

        // Start the proxy server
        proxyServer = proxy.listen(0, () => {
            proxyServerPort = proxyServer.address().port;
            done();
        });
    });

    afterAll((done) => {
        proxyServer.close(done);
    });

  it('should forward requests to the target URL and return the response', async () => {
    const response = await request(`http://localhost:${proxyServerPort}`).get('/test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Hello from target!' });
  });

  it('should return 404 if the target URL returns 404', async () => {
    const response = await request(`http://localhost:${proxyServerPort}`).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});
