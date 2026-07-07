import Game from '../models/Game.model.js';
import Review from '../models/Review.model.js';

/** Count total games */
const countGames = async () => {
  const total = await Game.countDocuments({ isArchived: { $ne: true } });
  return { total };
};

/** Top-rated games */
const getTopRated = async (queryString) => {
  const limit = parseInt(queryString.limit) || 10;
  const page  = parseInt(queryString.page)  || 1;
  const skip  = (page - 1) * limit;
  const [games, total] = await Promise.all([
    Game.find({ averageRating: { $gt: 0 }, isArchived: { $ne: true } })
      .sort({ averageRating: -1 })
      .skip(skip).limit(limit)
      .select('name averageRating reviewCount headerImage price isFree')
      .lean(),
    Game.countDocuments({ averageRating: { $gt: 0 }, isArchived: { $ne: true } }),
  ]);
  return { games, total, page, limit, pages: Math.ceil(total / limit) };
};

/** Most downloaded / most reviewed */
const getMostDownloaded = async (queryString) => {
  const limit = parseInt(queryString.limit) || 10;
  const page  = parseInt(queryString.page)  || 1;
  const skip  = (page - 1) * limit;
  const [games, total] = await Promise.all([
    Game.find({ reviewCount: { $gt: 0 }, isArchived: { $ne: true } })
      .sort({ reviewCount: -1 })
      .skip(skip).limit(limit)
      .select('name reviewCount averageRating headerImage price isFree')
      .lean(),
    Game.countDocuments({ reviewCount: { $gt: 0 }, isArchived: { $ne: true } }),
  ]);
  return { games, total, page, limit, pages: Math.ceil(total / limit) };
};

/** Average game price across all non-free games */
const getAveragePrice = async () => {
  const result = await Game.aggregate([
    { $match: { isFree: false, price: { $gt: 0 }, isArchived: { $ne: true } } },
    { $group: { _id: null, averagePrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' }, count: { $sum: 1 } } },
    { $project: { _id: 0, averagePrice: { $round: ['$averagePrice', 2] }, minPrice: 1, maxPrice: 1, count: 1 } },
  ]);
  return result[0] || { averagePrice: 0, minPrice: 0, maxPrice: 0, count: 0 };
};

/** Average rating across all rated games */
const getAverageRating = async () => {
  const result = await Game.aggregate([
    { $match: { averageRating: { $gt: 0 }, isArchived: { $ne: true } } },
    { $group: { _id: null, averageRating: { $avg: '$averageRating' }, count: { $sum: 1 } } },
    { $project: { _id: 0, averageRating: { $round: ['$averageRating', 2] }, count: 1 } },
  ]);
  return result[0] || { averageRating: 0, count: 0 };
};

/** Count of games per genre */
const getGenreCount = async () => {
  return Game.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $project: { allGenres: { $concatArrays: [{ $ifNull: ['$genre', []] }, { $ifNull: ['$genres', []] }] } } },
    { $unwind: '$allGenres' },
    { $group: { _id: '$allGenres', count: { $sum: 1 } } },
    { $match: { _id: { $ne: '' } } },
    { $sort: { count: -1 } },
    { $project: { genre: '$_id', count: 1, _id: 0 } },
  ]);
};

/** Count of games per platform */
const getPlatformCount = async () => {
  const [windows, mac, linux, total] = await Promise.all([
    Game.countDocuments({ 'platforms.windows': true }),
    Game.countDocuments({ 'platforms.mac': true }),
    Game.countDocuments({ 'platforms.linux': true }),
    Game.countDocuments({ isArchived: { $ne: true } }),
  ]);
  return { windows, mac, linux, total };
};

/** Count free-to-play games */
const getFreeToPlayCount = async () => {
  const count = await Game.countDocuments({ isFree: true, isArchived: { $ne: true } });
  return { freeToPlay: count };
};

/** Count multiplayer games */
const getMultiplayerCount = async () => {
  const count = await Game.countDocuments({
    tags: { $in: [/multi-player/i] },
    isArchived: { $ne: true },
  });
  return { multiplayer: count };
};

/** Games released per month across all years */
const getMonthlyReleases = async () => {
  return Game.aggregate([
    { $match: { releaseDate: { $exists: true, $ne: null }, isArchived: { $ne: true } } },
    {
      $group: {
        _id: { year: { $year: '$releaseDate' }, month: { $month: '$releaseDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 24 },
    { $project: { year: '$_id.year', month: '$_id.month', count: 1, _id: 0 } },
  ]);
};

export default {
  countGames, getTopRated, getMostDownloaded, getAveragePrice, getAverageRating,
  getGenreCount, getPlatformCount, getFreeToPlayCount, getMultiplayerCount, getMonthlyReleases,
};
