/**
 * userService — Frontend service layer for /api/v1/users endpoints
 *
 * Mirrors backend user.controller.js & user.routes.js exactly.
 * Supports pagination query params used by getPagination() on the backend.
 */

import api from './api.js';

const unwrap = (response) => response.data;

// ── Default pagination params ──────────────────────────────────────────────
const DEFAULT_PARAMS = { page: 1, limit: 20, sort: '-createdAt' };

const userService = {
  /**
   * GET /users?page=&limit=&sort=&search=
   * @param {object} params  pagination + filter params
   * @returns {{ users: object[], total: number, page: number, pages: number }}
   */
  getAllUsers: async (params = {}) => {
    const res = await api.get('/users', {
      params: { ...DEFAULT_PARAMS, ...params },
    });
    return unwrap(res);
  },

  /**
   * GET /users/:id
   * @param {string} id  user ObjectId
   * @returns {object} user document
   */
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return unwrap(res);
  },

  /**
   * PUT /users/profile  → Update current user's own profile
   * @param {{ name?: string, avatar?: string, bio?: string }} payload
   * @returns {object} updated user
   */
  updateProfile: async (payload) => {
    const res = await api.put('/users/profile', payload);
    return unwrap(res);
  },

  /**
   * DELETE /users/:id  → Admin-only
   * @param {string} id  user ObjectId
   */
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return unwrap(res);
  },

  /**
   * PUT /users/:id  → Admin-only
   * @param {string} id user ObjectId
   * @param {object} payload
   */
  updateUser: async (id, payload) => {
    const res = await api.put(`/users/${id}`, payload);
    return unwrap(res);
  },

  /**
   * POST /auth/register → Create a new user
   * @param {object} payload { name, email, password, role }
   */
  createUser: async (payload) => {
    // For admin creation, we can use the register endpoint
    // since it returns the user and doesn't explicitly restrict role setting 
    // unless the backend blocks it (if it blocks role, we might need a dedicated admin endpoint).
    // Let's use the register endpoint for now.
    const res = await api.post('/auth/register', payload);
    return unwrap(res);
  },
};

export default userService;
