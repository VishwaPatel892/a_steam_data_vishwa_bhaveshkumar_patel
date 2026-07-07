// ── API Configuration ──────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/** Axios request timeout in milliseconds */
export const API_TIMEOUT = 15_000;

/**
 * Retry configuration for the Axios response interceptor.
 * Only idempotent HTTP methods on transient errors are retried.
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 500,                            // ms (doubles each attempt)
  retryableMethods: ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'],
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// ── App Info ───────────────────────────────────────────────────────────────
export const APP_CONFIG = {
  NAME: 'A Steam Dashboard',
  VERSION: '1.0.0',
};

// ── HTTP Status Codes (for readable comparisons) ───────────────────────────
export const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};

// ── Pagination defaults ────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  DEFAULT_SORT: '-createdAt',
};
