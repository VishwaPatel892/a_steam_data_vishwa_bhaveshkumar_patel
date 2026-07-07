import { Router } from 'express';
import reviewController from '../controllers/review.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// ─── Public ──────────────────────────────────────────────────────────────────
/**
 * @desc   Get all reviews for a specific game
 * @route  GET /api/v1/reviews/game/:gameId
 * @access Public
 */
router.get('/game/:gameId', reviewController.getReviewsByGame);

// ─── Protected (any authenticated user) ──────────────────────────────────────
/**
 * @desc   Create a review for a specific game
 * @route  POST /api/v1/reviews/game/:gameId
 * @access Private
 */
router.post('/game/:gameId', protect, reviewController.createReview);

/**
 * @desc   Update own review by review ID
 * @route  PUT /api/v1/reviews/:id
 * @access Private
 */
router.put('/:id', protect, reviewController.updateReview);

/**
 * @desc   Delete own review by review ID
 * @route  DELETE /api/v1/reviews/:id
 * @access Private
 */
router.delete('/:id', protect, reviewController.deleteReview);

export default router;
