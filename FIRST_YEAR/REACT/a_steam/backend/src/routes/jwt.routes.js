import { Router } from 'express';
import practiceController from '../controllers/practice.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// ─── JWT Practice Routes ──────────────────────────────────────────────────────
// All routes here require a valid JWT in the Authorization header (Bearer <token>)

router.get   ('/profile',          protect, practiceController.jwtProfile);
router.get   ('/dashboard',        protect, practiceController.jwtDashboard);
router.post  ('/generate-token',   protect, practiceController.generateJwtToken);
router.post  ('/verify-token',             practiceController.verifyJwtToken);    // public: just verifies
router.post  ('/refresh-token',    protect, practiceController.refreshJwtToken);
router.delete('/revoke-token',     protect, practiceController.revokeJwtToken);
router.get   ('/private-games',    protect, practiceController.jwtPrivateGames);
router.get   ('/private-analytics',protect, practiceController.jwtPrivateAnalytics);

export default router;
