const db = require('./db');
const bcrypt = require('bcryptjs');

// Create a new user
const createUser = async (email, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const result = await db('users').insert({ email, password: hashedPassword });
    return result;
  } catch (err) {
    throw new Error('Error creating user', err);
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const user = await db('users').where({ email }).first();
    return user;
  } catch (err) {
    throw new Error('Error finding user', err);
  }
};

module.exports = { createUser, findUserByEmail };