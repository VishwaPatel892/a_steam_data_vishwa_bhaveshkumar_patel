import { Router } from 'express';
import authRoutes       from './auth.routes.js';
import gameRoutes       from './game.routes.js';
import reviewRoutes     from './review.routes.js';
import userRoutes       from './user.routes.js';
import analyticsRoutes  from './analytics.routes.js';
import statsRoutes      from './stats.routes.js';
import searchRoutes     from './search.routes.js';
import advancedRoutes   from './advanced.routes.js';
import adminRoutes      from './admin.routes.js';
import middlewareRoutes from './middleware.routes.js';
import jwtRoutes        from './jwt.routes.js';

const router = Router();

// ─── Core Resource Routes ─────────────────────────────────────────────────────
router.use('/auth',        authRoutes);
router.use('/games',       gameRoutes);
router.use('/reviews',     reviewRoutes);
router.use('/users',       userRoutes);

// ─── Data Routes ──────────────────────────────────────────────────────────────
router.use('/analytics',   analyticsRoutes);
router.use('/stats',       statsRoutes);
router.use('/search',      searchRoutes);

// ─── Feature Routes ───────────────────────────────────────────────────────────
// advanced handles: /recommendations, /trending, /news, /compare, /timeline,
//                   /activity, /notifications, /system
router.use('/',            advancedRoutes);

// ─── Practice / Middleware Routes ─────────────────────────────────────────────
router.use('/admin',       adminRoutes);
router.use('/middleware',  middlewareRoutes);
router.use('/protected',   middlewareRoutes);  // /protected/games mirrors /middleware/games
router.use('/jwt',         jwtRoutes);

export default router;
