import { Router } from 'express';
import statsController from '../controllers/stats.controller.js';

const router = Router();

router.get('/games/count',              statsController.countGames);
router.get('/games/top-rated',          statsController.getTopRated);
router.get('/games/most-downloaded',    statsController.getMostDownloaded);
router.get('/games/average-price',      statsController.getAveragePrice);
router.get('/games/average-rating',     statsController.getAverageRating);
router.get('/games/genre-count',        statsController.getGenreCount);
router.get('/games/platform-count',     statsController.getPlatformCount);
router.get('/games/free-to-play-count', statsController.getFreeToPlayCount);
router.get('/games/multiplayer-count',  statsController.getMultiplayerCount);
router.get('/games/monthly-releases',   statsController.getMonthlyReleases);

export default router;
