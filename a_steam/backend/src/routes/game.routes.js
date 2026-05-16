const express = require("express");
const { validateBody } = require("../middlewares/validate.middleware");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { createGameSchema, updateGameSchema } = require("../validators/game.validator");
const gameController = require("../controllers/game.controller");

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

module.exports = router;
