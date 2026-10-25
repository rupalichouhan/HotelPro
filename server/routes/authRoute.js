const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026';

// @route   POST /api/users/SignUp or /api/users/signup
// @desc    Register a new user (Customer or Admin)
router.post(['/SignUp', '/signup', '/register'], async (req, res) => {
  try {
    const { name, email, password, c_password, phone, type } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, password, phone)',
      });
    }

    if (c_password && password !== c_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      c_password: c_password ? 'MATCHED' : undefined,
      phone: phone.trim(),
      type: type === 'admin' ? 'admin' : 'customer',
    });

    const savedUser = await newUser.save();

    const payload = {
      user: {
        id: savedUser._id,
        user_id: savedUser.user_id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        type: savedUser.type,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: payload.user,
    });
  } catch (error) {
    console.error('Error in SignUp route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while registering user',
      error: error.message,
    });
  }
});

// @route   POST /api/users/Login or /api/users/login
// @desc    Authenticate user and get token
router.post(['/Login', '/login'], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials. User does not exist.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    const payload = {
      user: {
        id: user._id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
      },
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: payload.user,
    });
  } catch (error) {
    console.error('Error in Login route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message,
    });
  }
});

// @route   GET /api/users/getallusers
// @desc    Get all registered users (for Admin Dashboard)
router.get('/getallusers', async (req, res) => {
  try {
    const users = await User.find().select('-password -c_password').sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error in getallusers route:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
});

// @route   GET /api/users/getuser
// @desc    Get current user profile from token
router.get('/getuser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -c_password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error in getuser route:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
