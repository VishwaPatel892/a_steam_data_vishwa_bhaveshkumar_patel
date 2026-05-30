import { Router } from 'express';
import authRoutes      from './auth.routes.js';
import gameRoutes      from './game.routes.js';
import reviewRoutes    from './review.routes.js';
import userRoutes      from './user.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/auth',      authRoutes);
router.use('/games',     gameRoutes);
router.use('/reviews',   reviewRoutes);
router.use('/users',     userRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
