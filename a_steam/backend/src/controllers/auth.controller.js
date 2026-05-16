const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const authService = require("../services/auth.service");

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { user, token } = await authService.register({ name, email, password });
  res.status(201).json(apiResponse.success("User registered successfully", { user, token }));
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.status(200).json(apiResponse.success("Login successful", { user, token }));
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  res.status(200).json(apiResponse.success("User fetched successfully", user));
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json(apiResponse.success("Logged out successfully"));
});

module.exports = { register, login, getMe, logout };
