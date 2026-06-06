import { Router } from 'express';
import practiceController from '../controllers/practice.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// ─── Middleware Practice Routes ───────────────────────────────────────────────
// These routes demonstrate and test that each middleware is correctly configured.

/** Tests that the global logger middleware is active */
router.get('/logger', practiceController.testLogger);

/** Tests that the protect (auth) middleware works */
router.get('/auth', protect, practiceController.testAuth);

/** Tests that global rate limiting is applied */
router.get('/rate-limit', practiceController.testRateLimit);

/** Triggers a controlled error to verify the global error handler */
router.get('/error-handler', practiceController.testErrorHandler);

// ─── Protected Game Routes ────────────────────────────────────────────────────
router.post  ('/games',        protect, practiceController.protectedCreateGame);
router.patch ('/games/:appid', protect, practiceController.protectedUpdateGame);
router.delete('/games/:appid', protect, practiceController.protectedDeleteGame);

export default router;
