import User from '../models/User.model.js';

const getAllUsers = async ({ page, limit, skip, search, sort }) => {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let sortObj = { createdAt: -1 }; // default
  if (sort) {
    const isDesc = sort.startsWith('-');
    const field = isDesc ? sort.substring(1) : sort;
    sortObj = { [field]: isDesc ? -1 : 1 };
  }

  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort(sortObj).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
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

const updateUser = async (id, data) => {
  const ALLOWED_FIELDS = ["name", "role", "isActive", "email"];
  const updates = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });
  const user = await User.findByIdAndUpdate(id, updates, {
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

export default {  getAllUsers, getUserById, updateProfile, deleteUser, updateUser  };
