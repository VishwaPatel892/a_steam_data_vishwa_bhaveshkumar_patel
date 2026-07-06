/**
 * authService — Frontend service layer for /api/v1/auth endpoints
 *
 * Mirrors backend auth.controller.js endpoints exactly.
 * Every method returns the unwrapped `data` from ApiResponse envelope.
 */

import api from './api.js';

// ── Helpers ────────────────────────────────────────────────────────────────
/** Extract data from backend ApiResponse: { success, message, data } */
const unwrap = (response) => response.data;

// ── Auth Service ───────────────────────────────────────────────────────────
const authService = {
  /**
   * POST /auth/register
   * @param {{ name: string, email: string, password: string }} payload
   * @returns {{ user: object, token: string }}
   */
  register: async (payload) => {
    const res = await api.post('/auth/register', payload);
    return unwrap(res);
  },

  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ user: object, token: string }}
   */
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return unwrap(res);
  },

  /**
   * GET /auth/profile  → Current user profile
   * @returns {object} user
   */
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return unwrap(res);
  },

  /**
   * GET /auth/me  → Alias for getProfile
   */
  getMe: async () => {
    const res = await api.get('/auth/me');
    return unwrap(res);
  },

  /**
   * PATCH /auth/me  → Update name, avatar, bio
   * @param {{ name?: string, avatar?: string, bio?: string }} payload
   * @returns {object} updated user
   */
  updateProfile: async (payload) => {
    const res = await api.patch('/auth/me', payload);
    return unwrap(res);
  },

  /**
   * PATCH /auth/change-password
   * @param {{ currentPassword: string, newPassword: string }} payload
   */
  changePassword: async (payload) => {
    const res = await api.patch('/auth/change-password', payload);
    return unwrap(res);
  },

  /**
   * POST /auth/logout
   */
  logout: async () => {
    const res = await api.post('/auth/logout');
    return unwrap(res);
  },

  /**
   * POST /auth/forgot-password
   * @param {string} email
   */
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return unwrap(res);
  },

  /**
   * POST /auth/reset-password
   * @param {{ token: string, newPassword: string }} payload
   */
  resetPassword: async (payload) => {
    const res = await api.post('/auth/reset-password', payload);
    return unwrap(res);
  },

  /**
   * POST /auth/verify-email
   * @param {string} token  — email verification token
   */
  verifyEmail: async (token) => {
    const res = await api.post('/auth/verify-email', { token });
    return unwrap(res);
  },

  /**
   * POST /auth/send-otp
   * @param {string} email
   */
  sendOtp: async (email) => {
    const res = await api.post('/auth/send-otp', { email });
    return unwrap(res);
  },

  // ── Admin ────────────────────────────────────────────────────────────────

  /**
   * GET /auth/users  → All users (admin)
   */
  getAllUsers: async () => {
    const res = await api.get('/auth/users');
    return unwrap(res);
  },

  /**
   * PATCH /auth/users/:id/status  → Toggle active/inactive (admin)
   * @param {string} id  user ObjectId
   */
  toggleUserStatus: async (id) => {
    const res = await api.patch(`/auth/users/${id}/status`);
    return unwrap(res);
  },
};

export default authService;
