import { Router } from 'express';
import analyticsController from '../controllers/analytics.controller.js';

const router = Router();

// ─── Analytics Routes — all prefixed /api/v1/analytics/games/... ──────────────

router.get('/games/top-rated',             analyticsController.getTopRatedGames);
router.get('/games/most-downloaded',       analyticsController.getMostDownloaded);
router.get('/games/revenue',               analyticsController.getRevenue);
router.get('/games/platform-distribution', analyticsController.getPlatformDistribution);
router.get('/games/genre-distribution',    analyticsController.getGenreDistribution);
router.get('/games/trending',              analyticsController.getTrending);
router.get('/games/release-trends',        analyticsController.getReleaseTrends);
router.get('/games/user-activity',         analyticsController.getUserActivity);
router.get('/games/wishlist-analysis',     analyticsController.getWishlistAnalysis);
router.get('/games/review-analysis',       analyticsController.getReviewAnalysis);

// ─── Legacy paths (kept for backward compatibility) ───────────────────────────
router.get('/top-rated',          analyticsController.getTopRatedGames);
router.get('/genre-distribution', analyticsController.getGenreDistribution);
router.get('/review-sentiment',   analyticsController.getReviewSentiment);
router.get('/releases-per-year',  analyticsController.getReleasesPerYear);
router.get('/publisher-stats',    analyticsController.getPublisherStats);

export default router;
