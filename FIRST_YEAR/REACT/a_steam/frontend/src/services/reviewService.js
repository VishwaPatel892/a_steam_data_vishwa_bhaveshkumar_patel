/**
 * reviewService — Frontend service layer for /api/v1/reviews endpoints
 *
 * Mirrors backend review.routes.js exactly.
 */

import api from './api.js';

const unwrap = (response) => response.data;

const reviewService = {
  /**
   * GET /reviews/game/:gameId
   */
  getReviewsByGame: async (gameId, params = {}) => {
    const res = await api.get(`/reviews/game/${gameId}`, { params });
    return unwrap(res);
  },

  /**
   * POST /reviews/game/:gameId (protected)
   */
  createReview: async (gameId, payload) => {
    const res = await api.post(`/reviews/game/${gameId}`, payload);
    return unwrap(res);
  },

  /**
   * PUT /reviews/:id (protected, own review)
   */
  updateReview: async (id, payload) => {
    const res = await api.put(`/reviews/${id}`, payload);
    return unwrap(res);
  },

  /**
   * DELETE /reviews/:id (protected, own review)
   */
  deleteReview: async (id) => {
    const res = await api.delete(`/reviews/${id}`);
    return unwrap(res);
  },
};

export default reviewService;
