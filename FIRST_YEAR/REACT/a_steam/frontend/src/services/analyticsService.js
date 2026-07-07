/**
 * analyticsService — Frontend service layer for /api/v1/analytics endpoints
 *
 * Mirrors backend analytics.controller.js & analytics.routes.js exactly.
 * All routes use GET and most accept an optional `limit` query param.
 */

import api from './api.js';

const unwrap = (response) => response.data;

const analyticsService = {
  // ── Game Analytics ─────────────────────────────────────────────────────────

  /**
   * GET /analytics/games/top-rated?limit=
   * @param {number} limit  default 10
   */
  getTopRatedGames: async (limit = 10) => {
    const res = await api.get('/analytics/games/top-rated', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/games/most-downloaded?limit=
   * @param {number} limit  default 10
   */
  getMostDownloaded: async (limit = 10) => {
    const res = await api.get('/analytics/games/most-downloaded', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/games/revenue?limit=
   * @param {number} limit  default 20
   */
  getRevenue: async (limit = 20) => {
    const res = await api.get('/analytics/games/revenue', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/games/platform-distribution
   */
  getPlatformDistribution: async () => {
    const res = await api.get('/analytics/games/platform-distribution');
    return unwrap(res);
  },

  /**
   * GET /analytics/games/genre-distribution
   */
  getGenreDistribution: async () => {
    const res = await api.get('/analytics/games/genre-distribution');
    return unwrap(res);
  },

  /**
   * GET /analytics/games/trending?limit=
   * @param {number} limit  default 10
   */
  getTrending: async (limit = 10) => {
    const res = await api.get('/analytics/games/trending', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/games/release-trends
   */
  getReleaseTrends: async () => {
    const res = await api.get('/analytics/games/release-trends');
    return unwrap(res);
  },

  /**
   * GET /analytics/games/user-activity?limit=
   * @param {number} limit  default 50
   */
  getUserActivity: async (limit = 50) => {
    const res = await api.get('/analytics/games/user-activity', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/games/wishlist-analysis
   */
  getWishlistAnalysis: async () => {
    const res = await api.get('/analytics/games/wishlist-analysis');
    return unwrap(res);
  },

  /**
   * GET /analytics/games/review-analysis
   */
  getReviewAnalysis: async () => {
    const res = await api.get('/analytics/games/review-analysis');
    return unwrap(res);
  },

  // ── Legacy endpoints (backward compat) ────────────────────────────────────

  /**
   * GET /analytics/top-rated?limit=  (legacy)
   */
  getTopRatedLegacy: async (limit = 10) => {
    const res = await api.get('/analytics/top-rated', { params: { limit } });
    return unwrap(res);
  },

  /**
   * GET /analytics/genre-distribution  (legacy)
   */
  getGenreDistributionLegacy: async () => {
    const res = await api.get('/analytics/genre-distribution');
    return unwrap(res);
  },

  /**
   * GET /analytics/review-sentiment  (legacy)
   */
  getReviewSentiment: async () => {
    const res = await api.get('/analytics/review-sentiment');
    return unwrap(res);
  },

  /**
   * GET /analytics/releases-per-year  (legacy)
   */
  getReleasesPerYear: async () => {
    const res = await api.get('/analytics/releases-per-year');
    return unwrap(res);
  },

  /**
   * GET /analytics/publisher-stats  (legacy)
   */
  getPublisherStats: async () => {
    const res = await api.get('/analytics/publisher-stats');
    return unwrap(res);
  },
};

export default analyticsService;
