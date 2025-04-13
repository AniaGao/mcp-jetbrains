// proxy.js
const express = require('express');
const axios = require('axios');

const app = express();
const targetUrl = process.env.TARGET_URL || 'http://localhost:3001'; // Default target URL

app.use((req, res) => {
  axios({
    method: req.method,
    url: `${targetUrl}${req.url}`,
    headers: req.headers,
    data: req.body,
    responseType: 'stream'
  })
  .then(response => {
    res.writeHead(response.status, response.headers);
    response.data.pipe(res);
  })
  .catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response from target:", error.response.status, error.response.data);
      res.writeHead(error.response.status, error.response.headers);
      error.response.data.pipe(res);

    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from target:", error.request);
      res.status(500).send('Error: No response from target server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up the request:", error.message);
      res.status(500).send('Error: Could not connect to target server.');
    }
  });
});

module.exports = app; // Export the app instance

// Start the server only if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
    console.log(`Proxying requests to ${targetUrl}`);
  });
}
