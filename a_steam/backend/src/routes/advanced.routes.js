import { Router } from 'express';
import advancedController from '../controllers/advanced.controller.js';
import { protect }        from '../middlewares/auth.middleware.js';

const router = Router();

// ─── Recommendations ─────────────────────────────────────────────────────────
router.get('/recommendations/games/:appid', advancedController.getRecommendations);

// ─── Trending ─────────────────────────────────────────────────────────────────
router.get('/trending/games', advancedController.getTrendingGames);

// ─── News ─────────────────────────────────────────────────────────────────────
router.get('/news/latest',   advancedController.getLatestNews);
router.get('/news/trending', advancedController.getTrendingNews);

// ─── Compare ──────────────────────────────────────────────────────────────────
router.get('/compare/games/:id1/:id2', advancedController.compareGames);

// ─── Timeline ─────────────────────────────────────────────────────────────────
router.get('/timeline/game/:appid', advancedController.getTimeline);

// ─── Activity Logs (protected) ────────────────────────────────────────────────
router.get('/activity/logs', protect, advancedController.getActivityLogs);

// ─── Notifications (protected) ────────────────────────────────────────────────
router.get   ('/notifications',          protect, advancedController.getNotifications);
router.patch ('/notifications/read/:id', protect, advancedController.markNotificationRead);
router.delete('/notifications/:id',      protect, advancedController.deleteNotification);

// ─── System ───────────────────────────────────────────────────────────────────
router.get('/system/info',    advancedController.getSystemInfo);
router.get('/system/version', advancedController.getSystemVersion);

export default router;
