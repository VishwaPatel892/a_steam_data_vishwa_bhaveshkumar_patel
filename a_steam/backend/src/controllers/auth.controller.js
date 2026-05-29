import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse  from '../utils/apiResponse.js';
import authService  from '../services/auth.service.js';

// ─── Public ──────────────────────────────────────────────────────────────────

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });

  res
    .status(201)
    .json(ApiResponse.success('User registered successfully', { user, token }, 201));
});

/**
 * @desc    Login user and return JWT
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });

  res.status(200).json(ApiResponse.success('Login successful', { user, token }));
});

// ─── Protected ───────────────────────────────────────────────────────────────

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res.status(200).json(ApiResponse.success('Profile fetched successfully', user));
});

/**
 * @desc    Update name, avatar, bio
 * @route   PATCH /api/v1/auth/me
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, bio } = req.body;
  const user = await authService.updateProfile(req.user._id, { name, avatar, bio });
  res.status(200).json(ApiResponse.success('Profile updated successfully', user));
});

/**
 * @desc    Change password (requires current password)
 * @route   PATCH /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user._id, { currentPassword, newPassword });
  res.status(200).json(ApiResponse.success(result.message));
});

/**
 * @desc    Logout (client-side — clears cookie if used)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json(ApiResponse.success('Logged out successfully'));
});

// ─── Admin ───────────────────────────────────────────────────────────────────

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/v1/auth/users
 * @access  Private / Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await authService.getAllUsers();
  res.status(200).json(ApiResponse.success('Users fetched successfully', users));
});

/**
 * @desc    Toggle user active/inactive (admin only)
 * @route   PATCH /api/v1/auth/users/:id/status
 * @access  Private / Admin
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await authService.toggleUserStatus(req.params.id);
  const msg  = user.isActive ? 'User activated' : 'User deactivated';
  res.status(200).json(ApiResponse.success(msg, user));
});

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  toggleUserStatus,
};
