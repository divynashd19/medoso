const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { formatUser, toId } = require('../utils/apiFormat');
const { validatePassword } = require('../utils/password');

const signToken = (user) =>
  jwt.sign(
    { id: toId(user), role: user.role },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, phone number, and password are required' });
    }

    if (!User.isValidPhone(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    if (await User.findByEmail(email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    if (await User.findByPhone(phone)) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const user = await User.createUser({ name, email, phone, password, role });
    const token = signToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email or phone number' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone number and password required' });
    }

    const user = await User.findByPhone(phone);
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, specialization, bio } = req.body;
    const updates = { name, specialization, bio };

    // Phone is the login identifier, so it must stay valid and unique.
    if (req.body.phone !== undefined) {
      if (!User.isValidPhone(req.body.phone)) {
        return res.status(400).json({ message: 'Please enter a valid phone number' });
      }
      const phone = User.normalizePhone(req.body.phone);
      const owner = await User.findByPhone(phone);
      if (owner && toId(owner) !== String(req.userId)) {
        return res.status(400).json({ message: 'This phone number is already in use' });
      }
      updates.phone = phone;
    }

    const user = await User.updateById(req.userId, updates);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: formatUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This phone number is already in use' });
    }
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.getDoctors();
    res.json(doctors.map(formatUser));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};
