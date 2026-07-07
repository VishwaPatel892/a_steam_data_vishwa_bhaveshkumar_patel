import Game from '../models/Game.model.js';
import Review from '../models/Review.model.js';
import Achievement from '../models/Achievement.model.js';
import DLC from '../models/DLC.model.js';
import GameUpdate from '../models/GameUpdate.model.js';
import News from '../models/News.model.js';
import QueryBuilder from '../utils/QueryBuilder.js';

// ─── Helper ───────────────────────────────────────────────────────────────────
const throwNotFound = (msg = 'Game not found') => {
  const e = new Error(msg);
  e.statusCode = 404;
  throw e;
};

const paginateTag = async (filter, queryString) => {
  const features = new QueryBuilder(Game.find({ ...filter, isArchived: { $ne: true } }), queryString)
    .sort().limitFields().paginate();
  const countFeatures = new QueryBuilder(Game.find({ ...filter, isArchived: { $ne: true } }), queryString);
  const [games, total] = await Promise.all([
    features.query.lean(),
    countFeatures.query.countDocuments(),
  ]);
  const { page, limit } = features.paginationMeta;
  return { games, total, page, limit, pages: Math.ceil(total / limit) };
};

// ─── Core CRUD ────────────────────────────────────────────────────────────────
const getAllGames = async (queryString) => {
  const qs = { ...queryString };

  // Build extra filter from query-param helpers
  const extra = {};

  if (qs.genre)       { extra.genre = { $in: [new RegExp(qs.genre, 'i')] }; delete qs.genre; }
  if (qs.developer)   { extra.developer = { $in: [new RegExp(qs.developer, 'i')] }; delete qs.developer; }
  if (qs.publisher)   { extra.publisher = { $in: [new RegExp(qs.publisher, 'i')] }; delete qs.publisher; }
  if (qs.tag)         { extra.tags = { $in: [new RegExp(qs.tag, 'i')] }; delete qs.tag; }
  if (qs.freeToPlay === 'true') { extra.isFree = true; delete qs.freeToPlay; }
  if (qs.multiplayer === 'true') { extra.tags = { $in: [/multi-player/i, /multiplayer/i] }; delete qs.multiplayer; }
  if (qs.discount === 'true')   { extra.price = { $gt: 0 }; delete qs.discount; } // placeholder
  if (qs.platform) {
    extra[`platforms.${qs.platform.toLowerCase()}`] = true;
    delete qs.platform;
  }
  if (qs.minPrice) { extra.price = { ...(extra.price || {}), $gte: parseFloat(qs.minPrice) }; delete qs.minPrice; }
  if (qs.maxPrice) { extra.price = { ...(extra.price || {}), $lte: parseFloat(qs.maxPrice) }; delete qs.maxPrice; }
  if (qs.rating)   { extra.averageRating = { $gte: parseFloat(qs.rating) }; delete qs.rating; }
  if (qs.releaseYear) {
    const y = parseInt(qs.releaseYear);
    extra.releaseDate = { $gte: new Date(`${y}-01-01`), $lte: new Date(`${y}-12-31`) };
    delete qs.releaseYear;
  }

  const base = { isArchived: { $ne: true }, ...extra };
  const features = new QueryBuilder(Game.find(base), qs).filter().sort().limitFields().paginate();
  const countQ   = new QueryBuilder(Game.find(base), qs).filter();
  const [games, total] = await Promise.all([features.query.lean(), countQ.query.countDocuments()]);
  const { page, limit } = features.paginationMeta;
  return { games, total, page, limit, pages: Math.ceil(total / limit) };
};

const getGameByAppId = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return game;
};

const createGame = async (data) => Game.create(data);

const updateGameByAppId = async (appid, data) => {
  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { $set: data, $push: { history: { action: 'UPDATE', details: 'Game details updated' } } },
    { new: true, runValidators: true }
  );
  if (!game) throwNotFound();
  return game;
};

const deleteGameByAppId = async (appid) => {
  const game = await Game.findOneAndDelete({ steamAppId: appid });
  if (!game) throwNotFound();
};

const searchGames = async (query) => {
  if (!query || !query.trim()) return [];
  return Game.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
      { genre: { $in: [new RegExp(query, 'i')] } },
      { genres: { $in: [new RegExp(query, 'i')] } },
      { developer: { $in: [new RegExp(query, 'i')] } },
    ],
    isArchived: { $ne: true },
  }).limit(20).lean();
};

const getSummary = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    price: game.price,
    isFree: game.isFree,
    reviewCount: game.reviewCount,
    averageRating: game.averageRating,
    genres: game.genres?.length ? game.genres : (game.genre || []),
    revenueEstimate: (game.price || 0) * (game.reviewCount || 0) * 30,
  };
};

const getHistory = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).select('history').lean();
  if (!game) throwNotFound();
  return game.history || [];
};

const archiveGame = async (appid) => {
  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { $set: { isArchived: true }, $push: { history: { action: 'ARCHIVE', details: 'Game was archived' } } },
    { new: true }
  );
  if (!game) throwNotFound();
  return game;
};

const restoreGame = async (appid) => {
  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { $set: { isArchived: false }, $push: { history: { action: 'RESTORE', details: 'Game was restored' } } },
    { new: true }
  );
  if (!game) throwNotFound();
  return game;
};

const getRandomGame = async () => {
  const games = await Game.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $sample: { size: 1 } },
  ]);
  if (!games?.length) throwNotFound('No games available');
  return games[0];
};

// ─── Game existence check ─────────────────────────────────────────────────────
const checkGameExists = async (appid) => {
  const count = await Game.countDocuments({ steamAppId: appid });
  return { exists: count > 0, appid };
};

// ─── Related Games ────────────────────────────────────────────────────────────
const getRelatedGames = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  const genres = [...(game.genres || []), ...(game.genre || [])].slice(0, 3);
  const tags   = (game.tags || []).slice(0, 5);
  return Game.find({
    steamAppId: { $ne: parseInt(appid) },
    isArchived: { $ne: true },
    $or: [
      { genres: { $in: genres } },
      { genre: { $in: genres } },
      { tags: { $in: tags } },
    ],
  }).limit(10).lean();
};

// ─── Screenshots ──────────────────────────────────────────────────────────────
const getScreenshots = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  // Return header image + any screenshots stored on the game document
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    headerImage: game.headerImage || '',
    screenshots: game.screenshots || [],
  };
};

// ─── Trailers ────────────────────────────────────────────────────────────────
const getTrailers = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    trailers: game.trailers || [],
  };
};

// ─── System Requirements ─────────────────────────────────────────────────────
const getSystemRequirements = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    platforms: game.platforms,
    systemRequirements: game.systemRequirements || {
      minimum: {},
      recommended: {},
    },
  };
};

// ─── DLC ──────────────────────────────────────────────────────────────────────
const getDLC = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return DLC.find({ baseGameId: game._id, isArchived: { $ne: true } }).sort({ releaseDate: -1 }).lean();
};

// ─── Achievements ─────────────────────────────────────────────────────────────
const getAchievements = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return Achievement.find({ gameId: game._id, isArchived: { $ne: true } }).sort({ rarityPercent: 1 }).lean();
};

// ─── Leaderboards ────────────────────────────────────────────────────────────
const getLeaderboards = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  // Return a structured placeholder; extend when a Leaderboard model is added
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    leaderboards: game.leaderboards || [],
  };
};

// ─── Game Updates ─────────────────────────────────────────────────────────────
const getGameUpdates = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return GameUpdate.find({ gameId: game._id }).sort({ releasedAt: -1 }).limit(20).lean();
};

// ─── Game News ───────────────────────────────────────────────────────────────
const getGameNews = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  return News.find({ gameId: game._id }).sort({ publishedAt: -1 }).limit(20).lean();
};

// ─── Review sub-resource ─────────────────────────────────────────────────────
const getGameReviews = async (appid, queryString) => {
  const game = await Game.findOne({ steamAppId: appid }).lean();
  if (!game) throwNotFound();
  const page  = parseInt(queryString.page) || 1;
  const limit = parseInt(queryString.limit) || 10;
  const skip  = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Review.find({ game: game._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments({ game: game._id }),
  ]);
  return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
};

// ─── Filter helpers ───────────────────────────────────────────────────────────
const buildTagFilter  = (tag)     => paginateTag({ tags: { $in: [new RegExp(tag, 'i')] } });
const buildGenreFilter = (genre)  => paginateTag({ $or: [{ genre: genre }, { genres: genre }] });

const filterFreeToPlay       = (qs) => paginateTag({ isFree: true }, qs);
const filterPaid             = (qs) => paginateTag({ isFree: false, price: { $gt: 0 } }, qs);
const filterDiscounted       = (qs) => paginateTag({ originalPrice: { $exists: true }, $expr: { $lt: ['$price', '$originalPrice'] } }, qs);
const filterEarlyAccess      = (qs) => paginateTag({ tags: { $in: [/early access/i] } }, qs);
const filterVrOnly           = (qs) => paginateTag({ tags: { $in: [/vr only/i, /requires vr headset/i] } }, qs);
const filterControllerSupport= (qs) => paginateTag({ tags: { $in: [/full controller support/i, /partial controller support/i] } }, qs);
const filterMultiplayer      = (qs) => paginateTag({ tags: { $in: [/multi-player/i] } }, qs);
const filterSingleplayer     = (qs) => paginateTag({ tags: { $in: [/single-player/i] } }, qs);
const filterCoop             = (qs) => paginateTag({ tags: { $in: [/co-op/i, /online co-op/i, /local co-op/i] } }, qs);
const filterOpenWorld        = (qs) => paginateTag({ tags: { $in: [/open world/i] } }, qs);
const filterSurvival         = (qs) => paginateTag({ $or: [{ tags: { $in: [/survival/i] } }, { genre: 'Survival' }, { genres: 'Survival' }] }, qs);
const filterHorror           = (qs) => paginateTag({ $or: [{ tags: { $in: [/horror/i] } }, { genre: 'Horror' }, { genres: 'Horror' }] }, qs);
const filterAnime            = (qs) => paginateTag({ tags: { $in: [/anime/i] } }, qs);
const filterIndie            = (qs) => paginateTag({ $or: [{ tags: { $in: [/indie/i] } }, { genre: 'Indie' }, { genres: 'Indie' }] }, qs);
const filterTopRated         = (qs) => paginateTag({ averageRating: { $gte: 4 } }, { ...qs, sort: '-averageRating' });

// ─── Sort helpers ─────────────────────────────────────────────────────────────
const sortByPriceDesc       = (qs) => paginateTag({}, { ...qs, sort: '-price' });
const sortByRatingDesc      = (qs) => paginateTag({}, { ...qs, sort: '-averageRating' });
const sortByDownloadsDesc   = (qs) => paginateTag({}, { ...qs, sort: '-reviewCount' });
const sortByReleaseDateDesc = (qs) => paginateTag({}, { ...qs, sort: '-releaseDate' });
const sortByPopularityDesc  = (qs) => paginateTag({}, { ...qs, sort: '-reviewCount,-averageRating' });

// ─── Route Parameter helpers ──────────────────────────────────────────────────
const getByGenre = async (genre, qs) =>
  paginateTag({ $or: [{ genre: { $regex: genre, $options: 'i' } }, { genres: { $regex: genre, $options: 'i' } }] }, qs);

const getByDeveloper = async (developer, qs) =>
  paginateTag({ developer: { $in: [new RegExp(developer, 'i')] } }, qs);

const getByPublisher = async (publisher, qs) =>
  paginateTag({ publisher: { $in: [new RegExp(publisher, 'i')] } }, qs);

const getByPlatform = async (platform, qs) => {
  const key = platform.toLowerCase();
  const validPlatforms = ['windows', 'mac', 'linux'];
  if (!validPlatforms.includes(key)) {
    const e = new Error(`Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
    e.statusCode = 400;
    throw e;
  }
  return paginateTag({ [`platforms.${key}`]: true }, qs);
};

const getByTag = async (tag, qs) =>
  paginateTag({ tags: { $in: [new RegExp(tag, 'i')] } }, qs);

const getByReleaseYear = async (year, qs) => {
  const y = parseInt(year);
  if (isNaN(y)) { const e = new Error('Invalid year'); e.statusCode = 400; throw e; }
  return paginateTag({ releaseDate: { $gte: new Date(`${y}-01-01`), $lte: new Date(`${y}-12-31`) } }, qs);
};

const getByRating = async (rating, qs) => {
  const r = parseFloat(rating);
  if (isNaN(r) || r < 0 || r > 5) { const e = new Error('Rating must be a number between 0 and 5'); e.statusCode = 400; throw e; }
  return paginateTag({ averageRating: { $gte: r } }, qs);
};

const getByPrice = async (price, qs) => {
  const p = parseFloat(price);
  if (isNaN(p) || p < 0) { const e = new Error('Invalid price value'); e.statusCode = 400; throw e; }
  return paginateTag({ price: { $lte: p } }, qs);
};

const getByFeature = async (feature, qs) =>
  paginateTag({ tags: { $in: [new RegExp(feature, 'i')] } }, qs);

export default {
  getAllGames, getGameByAppId, createGame, updateGameByAppId, deleteGameByAppId,
  searchGames, getSummary, getHistory, archiveGame, restoreGame, getRandomGame,
  checkGameExists, getRelatedGames,
  getScreenshots, getTrailers, getSystemRequirements, getDLC, getAchievements,
  getLeaderboards, getGameUpdates, getGameNews, getGameReviews,
  filterFreeToPlay, filterPaid, filterDiscounted, filterEarlyAccess, filterVrOnly,
  filterControllerSupport, filterMultiplayer, filterSingleplayer, filterCoop,
  filterOpenWorld, filterSurvival, filterHorror, filterAnime, filterIndie, filterTopRated,
  sortByPriceDesc, sortByRatingDesc, sortByDownloadsDesc, sortByReleaseDateDesc, sortByPopularityDesc,
  getByGenre, getByDeveloper, getByPublisher, getByPlatform, getByTag,
  getByReleaseYear, getByRating, getByPrice, getByFeature,
};
