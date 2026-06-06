import express from 'express';
import { validateBody } from '../middlewares/validate.middleware.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { createGameSchema, updateGameSchema } from '../validators/game.validator.js';
import gameController from '../controllers/game.controller.js';

const router = express.Router();

// ─── Static / Filter / Sort routes (must come BEFORE /:appid) ────────────────

// GET /api/v1/games/random
router.get('/random', gameController.getRandomGame);

// GET /api/v1/games/search?q=...
router.get('/search', gameController.searchGames);

// GET /api/v1/games/exists/:appid
router.get('/exists/:appid', gameController.checkGameExists);

// ─── Filter Routes ────────────────────────────────────────────────────────────
router.get('/filter/free-to-play',       gameController.filterFreeToPlay);
router.get('/filter/paid',               gameController.filterPaid);
router.get('/filter/discounted',         gameController.filterDiscounted);
router.get('/filter/early-access',       gameController.filterEarlyAccess);
router.get('/filter/vr-only',            gameController.filterVrOnly);
router.get('/filter/controller-support', gameController.filterControllerSupport);
router.get('/filter/multiplayer',        gameController.filterMultiplayer);
router.get('/filter/singleplayer',       gameController.filterSingleplayer);
router.get('/filter/coop',               gameController.filterCoop);
router.get('/filter/open-world',         gameController.filterOpenWorld);
router.get('/filter/survival',           gameController.filterSurvival);
router.get('/filter/horror',             gameController.filterHorror);
router.get('/filter/anime',              gameController.filterAnime);
router.get('/filter/indie',              gameController.filterIndie);
router.get('/filter/top-rated',          gameController.filterTopRated);

// ─── Sort Routes ──────────────────────────────────────────────────────────────
router.get('/sort/price-desc',       gameController.sortByPriceDesc);
router.get('/sort/rating-desc',      gameController.sortByRatingDesc);
router.get('/sort/downloads-desc',   gameController.sortByDownloadsDesc);
router.get('/sort/releaseDate-desc', gameController.sortByReleaseDateDesc);
router.get('/sort/popularity-desc',  gameController.sortByPopularityDesc);

// ─── Route Parameter Routes ───────────────────────────────────────────────────
router.get('/genre/:genre',             gameController.getByGenre);
router.get('/developer/:developer',     gameController.getByDeveloper);
router.get('/publisher/:publisher',     gameController.getByPublisher);
router.get('/platform/:platform',       gameController.getByPlatform);
router.get('/tag/:tag',                 gameController.getByTag);
router.get('/release-year/:year',       gameController.getByReleaseYear);
router.get('/rating/:rating',           gameController.getByRating);
router.get('/price/:price',             gameController.getByPrice);
router.get('/feature/:feature',         gameController.getByFeature);

// ─── Basic CRUD ───────────────────────────────────────────────────────────────

// GET /api/v1/games  (with full query-param filtering + pagination + sorting)
router.get('/', gameController.getAllGames);

// GET /api/v1/games/:appid  (single game)
router.get('/:appid', gameController.getGameById);

// ─── Game sub-resource routes (public) ───────────────────────────────────────
router.get('/:appid/summary',             gameController.getSummary);
router.get('/:appid/related',             gameController.getRelatedGames);
router.get('/:appid/screenshots',         gameController.getScreenshots);
router.get('/:appid/trailers',            gameController.getTrailers);
router.get('/:appid/system-requirements', gameController.getSystemRequirements);
router.get('/:appid/dlc',                 gameController.getDLC);
router.get('/:appid/achievements',        gameController.getAchievements);
router.get('/:appid/leaderboards',        gameController.getLeaderboards);
router.get('/:appid/updates',             gameController.getGameUpdates);
router.get('/:appid/news',                gameController.getGameNews);

// ─── Review sub-resource routes (nested under game) ──────────────────────────
router.get ('/:appid/reviews',             gameController.getGameReviews);
router.post('/:appid/reviews', protect,    gameController.addGameReview);
router.patch('/:appid/reviews/:reviewId', protect, gameController.updateGameReview);
router.delete('/:appid/reviews/:reviewId', protect, gameController.deleteGameReview);

// ─── Admin-only mutation routes ───────────────────────────────────────────────
router.post  ('/',               protect, authorize('admin'), validateBody(createGameSchema), gameController.createGame);
router.put   ('/:appid',         protect, authorize('admin'), validateBody(updateGameSchema), gameController.updateGame);
router.patch ('/:appid',         protect, authorize('admin'), validateBody(updateGameSchema), gameController.updateGame);
router.delete('/:appid',         protect, authorize('admin'), gameController.deleteGame);

router.get   ('/:appid/history', protect, authorize('admin'), gameController.getHistory);
router.patch ('/:appid/archive', protect, authorize('admin'), gameController.archiveGame);
router.patch ('/:appid/restore', protect, authorize('admin'), gameController.restoreGame);

export default router;
