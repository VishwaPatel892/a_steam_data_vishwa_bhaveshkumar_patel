import ApiResponse from '../utils/apiResponse.js';

// ─── 404 Not Found ───────────────────────────────────────────────────────────
const notFound = (req, res, next) => {
  const err = new Error(`Route not found — ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// ─── Global Error Handler ────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message    = err.message || 'Internal Server Error';

  // Mongoose: invalid ObjectId  →  404
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message    = 'Resource not found — invalid ID format';
  }

  // Mongoose: unique field violation  →  409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    statusCode  = 409;
    message     = `Duplicate value for '${field}' — please use a different value`;
  }

  // Mongoose: validation error  →  422
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // JWT: malformed / tampered  →  401
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token — please log in again';
  }

  // JWT: expired  →  401
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Your session has expired — please log in again';
  }

  // Log in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    if (err.stack) console.error(err.stack);
  }

  const response = ApiResponse.error(message, statusCode);

  // Attach stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export { notFound, errorHandler };

// Middleware verified
