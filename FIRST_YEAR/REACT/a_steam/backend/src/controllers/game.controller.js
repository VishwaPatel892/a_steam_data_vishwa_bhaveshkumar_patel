import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import gameService from '../services/game.service.js';
import Review from '../models/Review.model.js';

// ─── Basic CRUD ───────────────────────────────────────────────────────────────

/** GET /api/v1/games */
const getAllGames = asyncHandler(async (req, res) => {
  const result = await gameService.getAllGames(req.query);
  res.status(200).json(apiResponse.success('Games fetched successfully', result));
});

/** GET /api/v1/games/random */
const getRandomGame = asyncHandler(async (req, res) => {
  const game = await gameService.getRandomGame();
  res.status(200).json(apiResponse.success('Random game fetched successfully', game));
});

/** GET /api/v1/games/search */
const searchGames = asyncHandler(async (req, res) => {
  const games = await gameService.searchGames(req.query.q);
  res.status(200).json(apiResponse.success('Search results fetched', games));
});

/** GET /api/v1/games/exists/:appid */
const checkGameExists = asyncHandler(async (req, res) => {
  const result = await gameService.checkGameExists(req.params.appid);
  res.status(200).json(apiResponse.success('Game existence checked', result));
});

/** GET /api/v1/games/:appid */
const getGameById = asyncHandler(async (req, res) => {
  const game = await gameService.getGameByAppId(req.params.appid);
  res.status(200).json(apiResponse.success('Game fetched successfully', game));
});

/** POST /api/v1/games */
const createGame = asyncHandler(async (req, res) => {
  const game = await gameService.createGame(req.body);
  res.status(201).json(apiResponse.success('Game created successfully', game));
});

/** PUT/PATCH /api/v1/games/:appid */
const updateGame = asyncHandler(async (req, res) => {
  const game = await gameService.updateGameByAppId(req.params.appid, req.body);
  res.status(200).json(apiResponse.success('Game updated successfully', game));
});

/** DELETE /api/v1/games/:appid */
const deleteGame = asyncHandler(async (req, res) => {
  await gameService.deleteGameByAppId(req.params.appid);
  res.status(200).json(apiResponse.success('Game deleted successfully'));
});

// ─── Sub-resource handlers ────────────────────────────────────────────────────

/** GET /api/v1/games/:appid/summary */
const getSummary = asyncHandler(async (req, res) => {
  const summary = await gameService.getSummary(req.params.appid);
  res.status(200).json(apiResponse.success('Game summary fetched', summary));
});

/** GET /api/v1/games/:appid/history */
const getHistory = asyncHandler(async (req, res) => {
  const history = await gameService.getHistory(req.params.appid);
  res.status(200).json(apiResponse.success('Game history fetched', history));
});

/** PATCH /api/v1/games/:appid/archive */
const archiveGame = asyncHandler(async (req, res) => {
  const game = await gameService.archiveGame(req.params.appid);
  res.status(200).json(apiResponse.success('Game archived successfully', game));
});

/** PATCH /api/v1/games/:appid/restore */
const restoreGame = asyncHandler(async (req, res) => {
  const game = await gameService.restoreGame(req.params.appid);
  res.status(200).json(apiResponse.success('Game restored successfully', game));
});

/** GET /api/v1/games/:appid/related */
const getRelatedGames = asyncHandler(async (req, res) => {
  const games = await gameService.getRelatedGames(req.params.appid);
  res.status(200).json(apiResponse.success('Related games fetched', games));
});

/** GET /api/v1/games/:appid/screenshots */
const getScreenshots = asyncHandler(async (req, res) => {
  const data = await gameService.getScreenshots(req.params.appid);
  res.status(200).json(apiResponse.success('Screenshots fetched', data));
});

/** GET /api/v1/games/:appid/trailers */
const getTrailers = asyncHandler(async (req, res) => {
  const data = await gameService.getTrailers(req.params.appid);
  res.status(200).json(apiResponse.success('Trailers fetched', data));
});

/** GET /api/v1/games/:appid/system-requirements */
const getSystemRequirements = asyncHandler(async (req, res) => {
  const data = await gameService.getSystemRequirements(req.params.appid);
  res.status(200).json(apiResponse.success('System requirements fetched', data));
});

/** GET /api/v1/games/:appid/dlc */
const getDLC = asyncHandler(async (req, res) => {
  const data = await gameService.getDLC(req.params.appid);
  res.status(200).json(apiResponse.success('DLC list fetched', data));
});

/** GET /api/v1/games/:appid/achievements */
const getAchievements = asyncHandler(async (req, res) => {
  const data = await gameService.getAchievements(req.params.appid);
  res.status(200).json(apiResponse.success('Achievements fetched', data));
});

/** GET /api/v1/games/:appid/leaderboards */
const getLeaderboards = asyncHandler(async (req, res) => {
  const data = await gameService.getLeaderboards(req.params.appid);
  res.status(200).json(apiResponse.success('Leaderboards fetched', data));
});

/** GET /api/v1/games/:appid/updates */
const getGameUpdates = asyncHandler(async (req, res) => {
  const data = await gameService.getGameUpdates(req.params.appid);
  res.status(200).json(apiResponse.success('Game updates fetched', data));
});

/** GET /api/v1/games/:appid/news */
const getGameNews = asyncHandler(async (req, res) => {
  const data = await gameService.getGameNews(req.params.appid);
  res.status(200).json(apiResponse.success('Game news fetched', data));
});

// ─── Review sub-resource ─────────────────────────────────────────────────────

/** GET /api/v1/games/:appid/reviews */
const getGameReviews = asyncHandler(async (req, res) => {
  const data = await gameService.getGameReviews(req.params.appid, req.query);
  res.status(200).json(apiResponse.success('Game reviews fetched', data));
});

/** POST /api/v1/games/:appid/reviews */
const addGameReview = asyncHandler(async (req, res) => {
  const game = await import('../models/Game.model.js').then(m => m.default.findOne({ steamAppId: req.params.appid }));
  if (!game) return res.status(404).json(apiResponse.error('Game not found', 404));
  const review = await Review.create({ ...req.body, game: game._id, user: req.user._id });
  res.status(201).json(apiResponse.success('Review submitted successfully', review));
});

/** PATCH /api/v1/games/:appid/reviews/:reviewId */
const updateGameReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.reviewId, user: req.user._id },
    req.body, { new: true }
  );
  if (!review) return res.status(404).json(apiResponse.error('Review not found or not authorised', 404));
  res.status(200).json(apiResponse.success('Review updated successfully', review));
});

/** DELETE /api/v1/games/:appid/reviews/:reviewId */
const deleteGameReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user._id });
  if (!review) return res.status(404).json(apiResponse.error('Review not found or not authorised', 404));
  res.status(200).json(apiResponse.success('Review deleted successfully'));
});

// ─── Filter handlers ──────────────────────────────────────────────────────────

const filterFreeToPlay        = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Free-to-play games fetched', await gameService.filterFreeToPlay(req.query))));
const filterPaid              = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Paid games fetched', await gameService.filterPaid(req.query))));
const filterDiscounted        = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Discounted games fetched', await gameService.filterDiscounted(req.query))));
const filterEarlyAccess       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Early access games fetched', await gameService.filterEarlyAccess(req.query))));
const filterVrOnly            = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('VR-only games fetched', await gameService.filterVrOnly(req.query))));
const filterControllerSupport = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Controller-supported games fetched', await gameService.filterControllerSupport(req.query))));
const filterMultiplayer       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Multiplayer games fetched', await gameService.filterMultiplayer(req.query))));
const filterSingleplayer      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Singleplayer games fetched', await gameService.filterSingleplayer(req.query))));
const filterCoop              = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Co-op games fetched', await gameService.filterCoop(req.query))));
const filterOpenWorld         = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Open-world games fetched', await gameService.filterOpenWorld(req.query))));
const filterSurvival          = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Survival games fetched', await gameService.filterSurvival(req.query))));
const filterHorror            = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Horror games fetched', await gameService.filterHorror(req.query))));
const filterAnime             = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Anime games fetched', await gameService.filterAnime(req.query))));
const filterIndie             = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Indie games fetched', await gameService.filterIndie(req.query))));
const filterTopRated          = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Top-rated games fetched', await gameService.filterTopRated(req.query))));

// ─── Sort handlers ────────────────────────────────────────────────────────────

const sortByPriceDesc       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Games sorted by price (desc)', await gameService.sortByPriceDesc(req.query))));
const sortByRatingDesc      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Games sorted by rating (desc)', await gameService.sortByRatingDesc(req.query))));
const sortByDownloadsDesc   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Games sorted by downloads (desc)', await gameService.sortByDownloadsDesc(req.query))));
const sortByReleaseDateDesc = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Games sorted by release date (desc)', await gameService.sortByReleaseDateDesc(req.query))));
const sortByPopularityDesc  = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Games sorted by popularity (desc)', await gameService.sortByPopularityDesc(req.query))));

// ─── Route-parameter handlers ─────────────────────────────────────────────────

const getByGenre       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games for genre: ${req.params.genre}`, await gameService.getByGenre(req.params.genre, req.query))));
const getByDeveloper   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games by developer: ${req.params.developer}`, await gameService.getByDeveloper(req.params.developer, req.query))));
const getByPublisher   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games by publisher: ${req.params.publisher}`, await gameService.getByPublisher(req.params.publisher, req.query))));
const getByPlatform    = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games on platform: ${req.params.platform}`, await gameService.getByPlatform(req.params.platform, req.query))));
const getByTag         = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games with tag: ${req.params.tag}`, await gameService.getByTag(req.params.tag, req.query))));
const getByReleaseYear = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games from ${req.params.year}`, await gameService.getByReleaseYear(req.params.year, req.query))));
const getByRating      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games rated >= ${req.params.rating}`, await gameService.getByRating(req.params.rating, req.query))));
const getByPrice       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games priced <= ${req.params.price}`, await gameService.getByPrice(req.params.price, req.query))));
const getByFeature     = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success(`Games with feature: ${req.params.feature}`, await gameService.getByFeature(req.params.feature, req.query))));

export default {
  getAllGames, getRandomGame, searchGames, checkGameExists, getGameById,
  createGame, updateGame, deleteGame,
  getSummary, getHistory, archiveGame, restoreGame, getRelatedGames,
  getScreenshots, getTrailers, getSystemRequirements, getDLC, getAchievements,
  getLeaderboards, getGameUpdates, getGameNews,
  getGameReviews, addGameReview, updateGameReview, deleteGameReview,
  filterFreeToPlay, filterPaid, filterDiscounted, filterEarlyAccess, filterVrOnly,
  filterControllerSupport, filterMultiplayer, filterSingleplayer, filterCoop,
  filterOpenWorld, filterSurvival, filterHorror, filterAnime, filterIndie, filterTopRated,
  sortByPriceDesc, sortByRatingDesc, sortByDownloadsDesc, sortByReleaseDateDesc, sortByPopularityDesc,
  getByGenre, getByDeveloper, getByPublisher, getByPlatform, getByTag,
  getByReleaseYear, getByRating, getByPrice, getByFeature,
};
