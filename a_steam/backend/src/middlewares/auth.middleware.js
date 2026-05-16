const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Protect routes — verifies JWT and attaches user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const error = new Error("Not authorised — no token provided");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      const error = new Error("User belonging to this token no longer exists");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (err) {
    const error = new Error("Not authorised — invalid or expired token");
    error.statusCode = 401;
    throw error;
  }
});

/**
 * Role-based access control middleware factory
 * @example router.delete("/:id", protect, authorise("admin"))
 */
const authorise = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error(`Role '${req.user.role}' is not permitted to access this resource`);
    error.statusCode = 403;
    throw error;
  }
  next();
};

module.exports = protect;
module.exports.authorise = authorise;
