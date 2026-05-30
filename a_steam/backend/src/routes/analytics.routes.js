import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller.js';

const router = Router();

// ─── All Analytics routes are Public ─────────────────────────────────────────
/**
 * @desc   Get top-rated games (aggregation)
 * @route  GET /api/v1/analytics/top-rated?limit=10
 * @access Public
 */
router.get('/top-rated', analyticsController.getTopRatedGames);

/**
 * @desc   Get genre distribution across all games (aggregation)
 * @route  GET /api/v1/analytics/genre-distribution
 * @access Public
 */
router.get('/genre-distribution', analyticsController.getGenreDistribution);

/**
 * @desc   Get review sentiment summary per game (aggregation)
 * @route  GET /api/v1/analytics/review-sentiment
 * @access Public
 */
router.get('/review-sentiment', analyticsController.getReviewSentiment);

/**
 * @desc   Get number of games released per year (aggregation)
 * @route  GET /api/v1/analytics/releases-per-year
 * @access Public
 */
router.get('/releases-per-year', analyticsController.getReleasesPerYear);

/**
 * @desc   Get publisher performance statistics (aggregation)
 * @route  GET /api/v1/analytics/publisher-stats
 * @access Public
 */
router.get('/publisher-stats', analyticsController.getPublisherStats);

export default router;
