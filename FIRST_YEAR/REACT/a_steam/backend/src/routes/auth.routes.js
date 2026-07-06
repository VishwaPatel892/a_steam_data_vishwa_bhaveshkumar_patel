import { Router }             from 'express';
import authController         from '../controllers/auth.controller.js';
import { protect, authorise } from '../middlewares/auth.middleware.js';
import { validateBody }       from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  sendOtpSchema,
} from '../validators/auth.validation.js';

const router = Router();

// ─── Public routes ───────────────────────────────────────────────────────────
router.post('/register',      validateBody(registerSchema), authController.register);
router.post('/login',         validateBody(loginSchema),    authController.login);
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password',  validateBody(resetPasswordSchema),  authController.resetPassword);
router.post('/verify-email',    validateBody(verifyEmailSchema),    authController.verifyEmail);
router.post('/send-otp',        validateBody(sendOtpSchema),        authController.sendOtp);

// ─── Protected routes (any authenticated user) ───────────────────────────────
router.get   ('/me',              protect, authController.getMe);
router.get   ('/profile',         protect, authController.getMe);
router.patch ('/me',              protect, validateBody(updateProfileSchema), authController.updateProfile);
router.patch ('/profile',         protect, validateBody(updateProfileSchema), authController.updateProfile);
router.patch ('/change-password', protect, validateBody(changePasswordSchema), authController.changePassword);
router.post  ('/logout',          protect, authController.logout);

// ─── Admin-only routes ───────────────────────────────────────────────────────
router.get   ('/users',              protect, authorise('admin'), authController.getAllUsers);
router.patch ('/users/:id/status',   protect, authorise('admin'), authController.toggleUserStatus);

export default router;
