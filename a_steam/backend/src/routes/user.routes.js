import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { protect, authorise } from '../middlewares/auth.middleware.js';

const router = Router();

// ─── Admin-only ───────────────────────────────────────────────────────────────
/**
 * @desc   Get all users (paginated)
 * @route  GET /api/v1/users
 * @access Private / Admin
 */
router.get('/', protect, authorise('admin'), userController.getAllUsers);

/**
 * @desc   Get a specific user by ID
 * @route  GET /api/v1/users/:id
 * @access Private / Admin
 */
router.get('/:id', protect, authorise('admin'), userController.getUserById);

/**
 * @desc   Delete a user by ID
 * @route  DELETE /api/v1/users/:id
 * @access Private / Admin
 */
router.delete('/:id', protect, authorise('admin'), userController.deleteUser);

// ─── Protected (any authenticated user) ──────────────────────────────────────
/**
 * @desc   Update own profile (name, avatar, bio)
 * @route  PUT /api/v1/users/profile
 * @access Private
 */
router.put('/profile', protect, userController.updateProfile);

export default router;
