import User from '../models/User.model.js';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../config/env.js';
import generateToken from '../utils/generateToken.js';

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user._id);
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

/**
 * Login with email and password
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const token = generateToken(user._id);
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

/**
 * Get authenticated user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export default {  register, login, getMe  };
