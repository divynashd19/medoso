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
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.createUser({ name, email, password, role });
    const token = signToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
    const { name, phone, specialization, bio } = req.body;
    const user = await User.updateById(req.userId, { name, phone, specialization, bio });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: formatUser(user) });
  } catch (error) {
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
