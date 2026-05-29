import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../config/env.js';
import { generateToken } from '../utils/generateToken.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const safeUser = (user) => ({
  id:        user._id,
  name:      user.name,
  email:     user.email,
  role:      user.role,
  avatar:    user.avatar,
  bio:       user.bio,
  isActive:  user.isActive,
  createdAt: user.createdAt,
});

const throwErr = (msg, code = 400) => {
  const e = new Error(msg);
  e.statusCode = code;
  throw e;
};

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throwErr('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user._id);

  return { user: safeUser(user), token };
};

/**
 * Login with email + password
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throwErr('Invalid email or password', 401);
  if (!user.isActive) throwErr('Your account has been deactivated. Contact support.', 403);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throwErr('Invalid email or password', 401);

  const token = generateToken(user._id);
  return { user: safeUser(user), token };
};

/**
 * Get authenticated user profile
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throwErr('User not found', 404);
  return safeUser(user);
};

/**
 * Update profile (name, avatar, bio)
 */
const updateProfile = async (userId, { name, avatar, bio }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, avatar, bio },
    { new: true, runValidators: true }
  );
  if (!user) throwErr('User not found', 404);
  return safeUser(user);
};

/**
 * Change password — verifies current password first
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throwErr('User not found', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throwErr('Current password is incorrect', 401);

  user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await user.save();

  return { message: 'Password updated successfully' };
};

/**
 * Admin: get all users
 */
const getAllUsers = async () => {
  const users = await User.find().lean();
  return users.map(safeUser);
};

/**
 * Admin: deactivate / activate a user account
 */
const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throwErr('User not found', 404);

  user.isActive = !user.isActive;
  await user.save();
  return safeUser(user);
};

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAllUsers,
  toggleUserStatus,
};
