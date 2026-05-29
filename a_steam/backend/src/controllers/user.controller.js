import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import userService from '../services/user.service.js';
import { getPagination } from '../utils/pagination.js';

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const users = await userService.getAllUsers(pagination);
  res.status(200).json(apiResponse.success("Users fetched successfully", users));
});

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json(apiResponse.success("User fetched successfully", user));
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.status(200).json(apiResponse.success("Profile updated successfully", user));
});

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json(apiResponse.success("User deleted successfully"));
});

export default {  getAllUsers, getUserById, updateProfile, deleteUser  };
