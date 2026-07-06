import { verifyToken } from '../utils/generateToken.js';
import User            from '../models/User.model.js';
import asyncHandler    from '../utils/asyncHandler.js';
import ApiResponse     from '../utils/apiResponse.js';

// â”€â”€â”€ protect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Verifies JWT from Authorization header (Bearer <token>).
 * Attaches the user document to req.user on success.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Also accept token from secure HttpOnly cookie (optional)
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json(ApiResponse.error('Not authorised â€” no token provided', 401));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    // Differentiate between expired vs tampered token for better DX
    const msg =
      err.name === 'TokenExpiredError'
        ? 'Your session has expired â€” please log in again'
        : 'Not authorised â€” invalid token';
    return res.status(401).json(ApiResponse.error(msg, 401));
  }

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return res.status(401).json(ApiResponse.error('User belonging to this token no longer exists', 401));
  }

  if (!user.isActive) {
    return res.status(403).json(ApiResponse.error('Your account has been deactivated', 403));
  }

  req.user = user;
  next();
});

// â”€â”€â”€ authorise / authorize â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Role-based access control middleware factory.
 * Must be used AFTER `protect`.
 *
 * @param {...string} roles  - allowed roles, e.g. authorise('admin', 'moderator')
 *
 * @example
 *   router.delete('/:id', protect, authorise('admin'), controller.delete);
 */
const authorise = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          ApiResponse.error(
            `Role '${req.user.role}' is not permitted to access this resource`,
            403
          )
        );
    }
    next();
  };

// American-English alias
const authorize = authorise;

export { protect, authorise, authorize };
