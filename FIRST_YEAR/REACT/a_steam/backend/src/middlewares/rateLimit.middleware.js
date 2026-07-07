import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from '../config/env.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * General API rate limiter — applied to all /api/v1 routes
 */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(apiResponse.error("Too many requests — please try again later", 429));
  },
});

/**
 * Stricter rate limiter for auth endpoints (register / login)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(apiResponse.error("Too many auth attempts — please wait 15 minutes", 429));
  },
});

export {  apiLimiter, authLimiter  };
