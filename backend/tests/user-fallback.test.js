const assert = require('node:assert/strict');
const test = require('node:test');
const User = require('../models/User');

test('User model supports create and lookup without a MongoDB connection', async () => {
  const user = await User.createUser({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+91 98765-43210',
    password: 'secret123',
    role: 'patient',
  });

  const found = await User.findByEmail('test@example.com');

  assert.ok(user);
  assert.equal(found.email, 'test@example.com');
  assert.notEqual(found.password, 'secret123');
});

test('User model finds users by phone regardless of formatting', async () => {
  assert.equal((await User.findByPhone('9876543210')).email, 'test@example.com');
  assert.equal((await User.findByPhone('098765 43210')).email, 'test@example.com');
  assert.equal(await User.findByPhone('9999999999'), null);
  assert.equal(await User.findByPhone(''), null);
});

test('User model rejects a duplicate phone number', async () => {
  await assert.rejects(
    User.createUser({ name: 'Other', email: 'other@example.com', phone: '9876543210', password: 'secret123' }),
    (error) => error.code === 11000
  );
});
