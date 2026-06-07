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
};

export default userService;
