// AuthenticationController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cons = require('../codes');

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET ?? 'defaultSecret', { expiresIn: '1h' });
};

// Controller for user registration
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(cons.badrequest).json({ message: cons.userexists });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    const token = generateToken(newUser._id);
    res.status(cons.created).json({ userId: newUser._id, token });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(cons.unauthorized).json({ message: cons.invalidLogin });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(cons.unauthorized).json({ message: cons.invalidLogin });
    }
    const token = generateToken(user._id);
    res.status(cons.ok).json({ userId: user._id, token });
  } catch (error) {
    console.error(error);
    res.status(cons.internalerror).json({ message: cons.internalerror });
  }
};

// Controller for user logout (optional)
exports.logout = async (req, res) => {
  res.status(cons.ok).json({ message: cons.logout });
};
