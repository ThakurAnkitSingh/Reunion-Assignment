const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const userModel = require('../models/userModel');
const dotenv = require('dotenv');

dotenv.config();

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (user) return res.status(400).json({ message: 'User already exists' });

    const createdUser = await userModel.createUser(email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id };
    const token = jwt.encode(payload, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login };
