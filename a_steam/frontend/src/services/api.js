/**
 * ─── Axios Base Configuration ────────────────────────────────────────────────
 * Enterprise-grade HTTP client with:
 *   • JWT Bearer token injection
 *   • Centralised loading state management (via Redux)
 *   • Automatic retry with exponential back-off (idempotent requests)
 *   • Standardised error normalisation
 *   • 401 force-logout with redirect
 */

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, RETRY_CONFIG } from '../constants/index.js';

// ── Pending request tracker for loading state ──────────────────────────────
let pendingRequests = 0;
let _store = null; // lazily injected to avoid circular import

/**
 * Inject the Redux store after it is initialised.
 * Call once in main.jsx: injectStore(store)
 */
export const injectStore = (store) => {
  _store = store;
};

const dispatchLoading = (isLoading) => {
  if (_store) {
    _store.dispatch({ type: 'ui/setGlobalLoading', payload: isLoading });
  }
};

// ── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // include HttpOnly cookie when present
});

// ── Request Interceptor ────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // 1. Attach JWT from localStorage
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Increment pending counter → show global loader
    pendingRequests++;
    if (pendingRequests === 1) dispatchLoading(true);

    // 3. Attach request timestamp for retry tracking
    config.metadata = { startTime: Date.now(), retryCount: 0 };

    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// ── Response Interceptor ───────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Decrement pending counter → hide global loader when queue drains
    pendingRequests = Math.max(0, pendingRequests - 1);
    if (pendingRequests === 0) dispatchLoading(false);

    // Unwrap the backend ApiResponse envelope: { success, message, data }
    return response;
  },
  async (error) => {
    pendingRequests = Math.max(0, pendingRequests - 1);
    if (pendingRequests === 0) dispatchLoading(false);

    const { config, response } = error;

    // ── Retry Logic (exponential back-off) ─────────────────────────────────
    const isRetryable =
      config &&
      !config._skipRetry &&
      RETRY_CONFIG.retryableMethods.includes((config.method || '').toUpperCase()) &&
      RETRY_CONFIG.retryableStatuses.includes(response?.status ?? 0);

    if (isRetryable && config.metadata.retryCount < RETRY_CONFIG.maxRetries) {
      config.metadata.retryCount += 1;
      const delay =
        RETRY_CONFIG.retryDelay * 2 ** (config.metadata.retryCount - 1);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    // ── 401 → Force logout ─────────────────────────────────────────────────
    if (response?.status === 401) {
      localStorage.removeItem('token');
      if (_store) {
        _store.dispatch({ type: 'auth/forceLogout' });
      }
      // Avoid redirect loops on the login page itself
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

// ── Error Normaliser ───────────────────────────────────────────────────────
/**
 * Converts any Axios / network error into a consistent shape:
 * {
 *   message: string,
 *   status:  number | null,
 *   errors:  object | null,
 *   isNetworkError: boolean,
 *   isTimeout:      boolean,
 * }
 */
export const normalizeError = (error) => {
  if (error.isNormalized) return error; // already processed

  const normalized = {
    isNormalized: true,
    isNetworkError: !error.response && !!error.request,
    isTimeout: error.code === 'ECONNABORTED',
    status: error.response?.status ?? null,
    message:
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : !error.response && error.request
        ? 'No response from server. Check your connection.'
        : error.message || 'An unexpected error occurred.'),
    errors: error.response?.data?.errors ?? null,
  };

  // Attach to a real Error so stack traces work
  const err = new Error(normalized.message);
  Object.assign(err, normalized);
  return err;
};

export default api;
