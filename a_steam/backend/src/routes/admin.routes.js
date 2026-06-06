import { Router } from 'express';
import practiceController from '../controllers/practice.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.get('/games',     protect, authorize('admin'), practiceController.adminGames);
router.get('/analytics', protect, authorize('admin'), practiceController.adminAnalytics);
router.get('/reports',   protect, authorize('admin'), practiceController.adminReports);

export default router;
