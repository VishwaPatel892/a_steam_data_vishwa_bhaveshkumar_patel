import express from 'express';
import { validateBody } from '../middlewares/validate.middleware.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { createGameSchema, updateGameSchema } from '../validators/game.validator.js';
import gameController from '../controllers/game.controller.js';

const router = express.Router();

// Public routes
router.get("/", gameController.getAllGames);
router.get("/random", gameController.getRandomGame);
router.get("/search", gameController.searchGames);
router.get("/:appid", gameController.getGameById);
router.get("/:appid/summary", gameController.getSummary);

// Protected routes (Admin only for modifications)
router.use(protect);
router.use(authorize("admin"));

router.post("/", validateBody(createGameSchema), gameController.createGame);

router.put("/:appid", validateBody(updateGameSchema), gameController.updateGame);
router.patch("/:appid", validateBody(updateGameSchema), gameController.updateGame);
router.delete("/:appid", gameController.deleteGame);

// Additional features
router.get("/:appid/history", gameController.getHistory);
router.patch("/:appid/archive", gameController.archiveGame);
router.patch("/:appid/restore", gameController.restoreGame);

export default router;
