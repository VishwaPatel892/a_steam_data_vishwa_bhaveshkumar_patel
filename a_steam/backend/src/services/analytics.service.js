import Game from '../models/Game.model.js';
import Review from '../models/Review.model.js';
import Wishlist from '../models/Wishlist.model.js';
import ActivityLog from '../models/ActivityLog.model.js';

const getTopRatedGames = async (limit = 10) =>
  Game.aggregate([
    { $match: { averageRating: { $gt: 0 }, isArchived: { $ne: true } } },
    { $sort: { averageRating: -1 } },
    { $limit: limit },
    { $project: { name: 1, averageRating: 1, reviewCount: 1, headerImage: 1, price: 1, isFree: 1 } },
  ]);

const getMostDownloaded = async (limit = 10) =>
  Game.aggregate([
    { $match: { reviewCount: { $gt: 0 }, isArchived: { $ne: true } } },
    { $sort: { reviewCount: -1 } },
    { $limit: limit },
    { $project: { name: 1, reviewCount: 1, averageRating: 1, headerImage: 1, price: 1 } },
  ]);

const getRevenueAnalysis = async (limit = 20) =>
  Game.aggregate([
    { $match: { price: { $gt: 0 }, reviewCount: { $gt: 0 }, isArchived: { $ne: true } } },
    {
      $project: {
        name: 1, price: 1, reviewCount: 1, averageRating: 1,
        revenueEstimate: { $multiply: ['$price', '$reviewCount', 30] },
      },
    },
    { $sort: { revenueEstimate: -1 } },
    { $limit: limit },
  ]);

const getPlatformDistribution = async () => {
  const [windows, mac, linux, total] = await Promise.all([
    Game.countDocuments({ 'platforms.windows': true, isArchived: { $ne: true } }),
    Game.countDocuments({ 'platforms.mac': true, isArchived: { $ne: true } }),
    Game.countDocuments({ 'platforms.linux': true, isArchived: { $ne: true } }),
    Game.countDocuments({ isArchived: { $ne: true } }),
  ]);
  return {
    total,
    platforms: {
      windows: { count: windows, percentage: total ? +((windows / total) * 100).toFixed(1) : 0 },
      mac:     { count: mac,     percentage: total ? +((mac / total) * 100).toFixed(1) : 0 },
      linux:   { count: linux,   percentage: total ? +((linux / total) * 100).toFixed(1) : 0 },
    },
  };
};

const getGenreDistribution = async () =>
  Game.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $project: { allGenres: { $concatArrays: [{ $ifNull: ['$genre', []] }, { $ifNull: ['$genres', []] }] } } },
    { $unwind: '$allGenres' },
    { $match: { allGenres: { $ne: '' } } },
    { $group: { _id: '$allGenres', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { genre: '$_id', count: 1, _id: 0 } },
  ]);

const getTrendingGames = async (limit = 10) =>
  Game.aggregate([
    { $match: { isArchived: { $ne: true }, reviewCount: { $gt: 0 } } },
    {
      $project: {
        name: 1, averageRating: 1, reviewCount: 1, headerImage: 1, price: 1, isFree: 1, releaseDate: 1,
        trendScore: { $add: [{ $multiply: ['$reviewCount', 0.4] }, { $multiply: ['$averageRating', 0.6] }] },
      },
    },
    { $sort: { trendScore: -1 } },
    { $limit: limit },
  ]);

const getReleaseTrends = async () =>
  Game.aggregate([
    { $match: { releaseDate: { $exists: true, $ne: null }, isArchived: { $ne: true } } },
    { $group: { _id: { $year: '$releaseDate' }, count: { $sum: 1 }, avgPrice: { $avg: '$price' }, avgRating: { $avg: '$averageRating' } } },
    { $sort: { _id: -1 } },
    { $limit: 20 },
    { $project: { year: '$_id', count: 1, avgPrice: { $round: ['$avgPrice', 2] }, avgRating: { $round: ['$avgRating', 2] }, _id: 0 } },
  ]);

const getUserActivity = async (limit = 50) => {
  try {
    return await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username email')
      .lean();
  } catch {
    return [];
  }
};

const getWishlistAnalysis = async () => {
  try {
    return await Wishlist.aggregate([
      { $unwind: '$games' },
      { $group: { _id: '$games', wishlistCount: { $sum: 1 } } },
      { $sort: { wishlistCount: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
      { $unwind: { path: '$game', preserveNullAndEmptyArrays: true } },
      { $project: { gameName: '$game.name', steamAppId: '$game.steamAppId', wishlistCount: 1, _id: 0 } },
    ]);
  } catch {
    return [];
  }
};

const getReviewAnalysis = async () =>
  Review.aggregate([
    { $group: { _id: '$game', totalReviews: { $sum: 1 }, positive: { $sum: { $cond: ['$recommended', 1, 0] } }, negative: { $sum: { $cond: ['$recommended', 0, 1] } }, avgRating: { $avg: '$rating' } } },
    { $lookup: { from: 'games', localField: '_id', foreignField: '_id', as: 'game' } },
    { $unwind: { path: '$game', preserveNullAndEmptyArrays: true } },
    { $project: { gameName: '$game.name', totalReviews: 1, positive: 1, negative: 1, avgRating: { $round: ['$avgRating', 2] }, positiveRatio: { $round: [{ $cond: [{ $gt: ['$totalReviews', 0] }, { $divide: ['$positive', '$totalReviews'] }, 0] }, 2] }, _id: 0 } },
    { $sort: { totalReviews: -1 } },
    { $limit: 50 },
  ]);

const getPublisherStats = async () =>
  Game.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $unwind: '$publisher' },
    { $group: { _id: '$publisher', totalGames: { $sum: 1 }, avgRating: { $avg: '$averageRating' }, totalReviews: { $sum: '$reviewCount' } } },
    { $match: { _id: { $ne: '' } } },
    { $project: { publisher: '$_id', totalGames: 1, avgRating: { $round: ['$avgRating', 2] }, totalReviews: 1, _id: 0 } },
    { $sort: { totalGames: -1 } },
    { $limit: 20 },
  ]);

const getReleasesPerYear = async () =>
  Game.aggregate([
    { $match: { releaseDate: { $exists: true, $ne: null } } },
    { $group: { _id: { $year: '$releaseDate' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { year: '$_id', count: 1, _id: 0 } },
  ]);

const getReviewSentiment = async () => getReviewAnalysis();

export default {
  getTopRatedGames, getMostDownloaded, getRevenueAnalysis, getPlatformDistribution,
  getGenreDistribution, getTrendingGames, getReleaseTrends, getUserActivity,
  getWishlistAnalysis, getReviewAnalysis, getPublisherStats, getReleasesPerYear,
  getReviewSentiment,
};
