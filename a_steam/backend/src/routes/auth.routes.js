import { Router }             from 'express';
import authController         from '../controllers/auth.controller.js';
import { protect, authorise } from '../middlewares/auth.middleware.js';
import { validateBody }       from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validation.js';

const router = Router();

// ─── Public routes ───────────────────────────────────────────────────────────
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login',    validateBody(loginSchema),    authController.login);

// ─── Protected routes (any authenticated user) ───────────────────────────────
router.get   ('/me',              protect, authController.getMe);
router.patch ('/me',              protect, validateBody(updateProfileSchema), authController.updateProfile);
router.patch ('/change-password', protect, validateBody(changePasswordSchema), authController.changePassword);
router.post  ('/logout',          protect, authController.logout);

// ─── Admin-only routes ───────────────────────────────────────────────────────
router.get   ('/users',              protect, authorise('admin'), authController.getAllUsers);
router.patch ('/users/:id/status',   protect, authorise('admin'), authController.toggleUserStatus);

export default router;
