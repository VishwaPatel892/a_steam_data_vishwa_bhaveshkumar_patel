import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse  from '../utils/apiResponse.js';
import { generateToken, verifyToken, decodeToken } from '../utils/generateToken.js';

// ─── Practice Controller ──────────────────────────────────────────────────────
// These are lightweight demonstration/practice endpoints that simply echo back
// a success response confirming that the middleware executed successfully.
// In a real application these would have proper business logic.

// ─── Middleware Practice ──────────────────────────────────────────────────────

/** GET /api/v1/middleware/logger  — confirms logger middleware ran */
const testLogger = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Logger middleware is active', {
    method: req.method,
    url:    req.originalUrl,
    ip:     req.ip,
    timestamp: new Date().toISOString(),
  }));
});

/** GET /api/v1/middleware/auth  — confirms protect middleware ran */
const testAuth = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Auth middleware passed — user is authenticated', {
    userId: req.user._id,
    role:   req.user.role,
    email:  req.user.email,
  }));
});

/** GET /api/v1/middleware/rate-limit  — confirms rate limiter is applied */
const testRateLimit = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Rate-limit middleware is active', {
    message: 'This route is protected by global rate limiting (100 req / 15 min)',
    remaining: res.getHeader('X-RateLimit-Remaining') ?? 'N/A',
  }));
});

/** GET /api/v1/middleware/error-handler  — triggers a test error to validate global handler */
const testErrorHandler = asyncHandler(async (req, res) => {
  // Intentionally throw so the global error handler picks it up
  const err = new Error('This is a test error — global error handler is working correctly');
  err.statusCode = 418;
  throw err;
});

// ─── Admin Practice ───────────────────────────────────────────────────────────

/** GET /api/v1/admin/games  — admin-protected game list stub */
const adminGames = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Admin: games route accessible', {
    note: 'This route requires admin role. Use /api/v1/games for the full game list.',
  }));
});

/** GET /api/v1/admin/analytics  — admin-protected analytics stub */
const adminAnalytics = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Admin: analytics dashboard accessible', {
    note: 'Full analytics available at /api/v1/analytics/games/*',
  }));
});

/** GET /api/v1/admin/reports  — admin-protected reports stub */
const adminReports = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Admin: reports route accessible', {
    availableReports: ['revenue', 'user-activity', 'genre-distribution', 'platform-distribution'],
  }));
});

// ─── Protected Practice ───────────────────────────────────────────────────────

/** POST /api/v1/protected/games  — protected game create stub */
const protectedCreateGame = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Protected: game creation route is accessible', {
    note: 'Use POST /api/v1/games (admin only) for real game creation.',
  }));
});

/** PATCH /api/v1/protected/games/:appid  — protected game update stub */
const protectedUpdateGame = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success(`Protected: game update route accessible for appid ${req.params.appid}`, {
    note: 'Use PATCH /api/v1/games/:appid (admin only) for real updates.',
  }));
});

/** DELETE /api/v1/protected/games/:appid  — protected game delete stub */
const protectedDeleteGame = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success(`Protected: game delete route accessible for appid ${req.params.appid}`, {
    note: 'Use DELETE /api/v1/games/:appid (admin only) for real deletion.',
  }));
});

// ─── JWT Practice ─────────────────────────────────────────────────────────────

/** GET /api/v1/jwt/profile  — JWT-protected profile */
const jwtProfile = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('JWT profile accessed successfully', {
    userId: req.user._id,
    name:   req.user.name,
    email:  req.user.email,
    role:   req.user.role,
  }));
});

/** GET /api/v1/jwt/dashboard  — JWT-protected dashboard */
const jwtDashboard = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('JWT dashboard accessed successfully', {
    userId:  req.user._id,
    message: 'You have access to the protected JWT dashboard.',
  }));
});

/** POST /api/v1/jwt/generate-token  — generate a JWT for the authenticated user */
const generateJwtToken = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  res.status(200).json(ApiResponse.success('JWT generated successfully', { token }));
});

/** POST /api/v1/jwt/verify-token  — verify a provided JWT */
const verifyJwtToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json(ApiResponse.error('Token is required', 400));

  try {
    const decoded = verifyToken(token);
    res.status(200).json(ApiResponse.success('Token is valid', { decoded }));
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token has expired' : 'Token is invalid';
    res.status(401).json(ApiResponse.error(msg, 401));
  }
});

/** POST /api/v1/jwt/refresh-token  — refresh a JWT for the authenticated user */
const refreshJwtToken = asyncHandler(async (req, res) => {
  const newToken = generateToken(req.user._id);
  res.status(200).json(ApiResponse.success('JWT refreshed successfully', { token: newToken }));
});

/** DELETE /api/v1/jwt/revoke-token  — revoke JWT (client-side: clear cookie) */
const revokeJwtToken = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json(ApiResponse.success('JWT revoked successfully — clear the token on the client side'));
});

/** GET /api/v1/jwt/private-games  — JWT-protected games list */
const jwtPrivateGames = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('JWT private games accessible', {
    note: 'Use /api/v1/games for the full games list. This is a JWT-protected demonstration route.',
  }));
});

/** GET /api/v1/jwt/private-analytics  — JWT-protected analytics */
const jwtPrivateAnalytics = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('JWT private analytics accessible', {
    note: 'Use /api/v1/analytics/games/* for full analytics. This is a JWT-protected demonstration route.',
  }));
});

export default {
  testLogger,
  testAuth,
  testRateLimit,
  testErrorHandler,
  adminGames,
  adminAnalytics,
  adminReports,
  protectedCreateGame,
  protectedUpdateGame,
  protectedDeleteGame,
  jwtProfile,
  jwtDashboard,
  generateJwtToken,
  verifyJwtToken,
  refreshJwtToken,
  revokeJwtToken,
  jwtPrivateGames,
  jwtPrivateAnalytics,
};
