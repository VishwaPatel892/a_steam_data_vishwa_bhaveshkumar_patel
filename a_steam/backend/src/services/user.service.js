const User = require("../models/User.model");

const getAllUsers = async ({ page, limit, skip }) => {
  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);
  return { users, total, page, limit, pages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateProfile = async (userId, data) => {
  const ALLOWED_FIELDS = ["name", "avatar", "bio"];
  const updates = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = { getAllUsers, getUserById, updateProfile, deleteUser };
