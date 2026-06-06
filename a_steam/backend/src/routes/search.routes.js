import { Router } from 'express';
import searchController from '../controllers/search.controller.js';

const router = Router();

/**
 * @desc   Full-text search across games
 * @route  GET /api/v1/search/games?q=...
 * @access Public
 */
router.get('/games', searchController.searchGames);

export default router;
