const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

process.env.FRONTEND_URL = 'http://localhost:3000';
const { app } = require('../server');

test('allows preflight requests from the deployed Netlify frontend', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  const address = server.address();
  const request = http.request({
    hostname: '127.0.0.1',
    port: address.port,
    path: '/api/auth/register',
    method: 'OPTIONS',
    headers: {
      Origin: 'https://agent-6a4a54bbecb69e8fc66fa485--medoso.netlify.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });

  const response = await new Promise((resolve, reject) => {
    request.on('error', reject);
    request.end();
    request.on('response', resolve);
  });

  const chunks = [];
  for await (const chunk of response) {
    chunks.push(chunk);
  }

  assert.equal(response.statusCode, 204);
  assert.equal(
    response.headers['access-control-allow-origin'],
    'https://agent-6a4a54bbecb69e8fc66fa485--medoso.netlify.app'
  );

  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});
