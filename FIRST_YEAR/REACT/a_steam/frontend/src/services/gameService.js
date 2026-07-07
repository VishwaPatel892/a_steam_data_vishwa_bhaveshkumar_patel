/**
 * gameService — Frontend service layer for /api/v1/games endpoints
 *
 * Mirrors backend game.routes.js exactly.
 */

import api from './api.js';

const unwrap = (response) => response.data;

const DEFAULT_PARAMS = { page: 1, limit: 20, sort: '-createdAt' };

const gameService = {
  /**
   * GET /games?page=&limit=&sort=&search=&genre=&platform=
   */
  getAllGames: async (params = {}) => {
    const res = await api.get('/games', {
      params: { ...DEFAULT_PARAMS, ...params },
    });
    return unwrap(res);
  },

  /**
   * GET /games/:appid
   */
  getGameById: async (appid) => {
    const res = await api.get(`/games/${appid}`);
    return unwrap(res);
  },

  /**
   * GET /games/search?q=...
   */
  searchGames: async (q) => {
    const res = await api.get('/games/search', { params: { q } });
    return unwrap(res);
  },

  /**
   * GET /games/sort/rating-desc
   */
  getTopRated: async (params = {}) => {
    const res = await api.get('/games/sort/rating-desc', { params });
    return unwrap(res);
  },

  /**
   * GET /games/sort/releaseDate-desc
   */
  getNewest: async (params = {}) => {
    const res = await api.get('/games/sort/releaseDate-desc', { params });
    return unwrap(res);
  },

  /**
   * GET /games/sort/popularity-desc
   */
  getMostPopular: async (params = {}) => {
    const res = await api.get('/games/sort/popularity-desc', { params });
    return unwrap(res);
  },

  /**
   * GET /games/filter/free-to-play
   */
  getFreeToPlay: async (params = {}) => {
    const res = await api.get('/games/filter/free-to-play', { params });
    return unwrap(res);
  },

  /**
   * GET /games/genre/:genre
   */
  getByGenre: async (genre, params = {}) => {
    const res = await api.get(`/games/genre/${encodeURIComponent(genre)}`, { params });
    return unwrap(res);
  },

  /**
   * POST /games (admin only)
   */
  createGame: async (payload) => {
    const res = await api.post('/games', payload);
    return unwrap(res);
  },

  /**
   * PUT /games/:appid (admin only)
   */
  updateGame: async (appid, payload) => {
    const res = await api.put(`/games/${appid}`, payload);
    return unwrap(res);
  },

  /**
   * DELETE /games/:appid (admin only)
   */
  deleteGame: async (appid) => {
    const res = await api.delete(`/games/${appid}`);
    return unwrap(res);
  },
};

export default gameService;
