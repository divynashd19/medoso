const assert = require('node:assert/strict');
const test = require('node:test');
const User = require('../models/User');

test('User model supports create and lookup without a MongoDB connection', async () => {
  const user = await User.createUser({
    name: 'Test User',
    email: 'test@example.com',
    password: 'secret123',
    role: 'patient',
  });

  const found = await User.findByEmail('test@example.com');

  assert.ok(user);
  assert.equal(found.email, 'test@example.com');
  assert.notEqual(found.password, 'secret123');
});
