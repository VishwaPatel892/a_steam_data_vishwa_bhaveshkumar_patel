import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse  from '../utils/apiResponse.js';
import Game         from '../models/Game.model.js';
import News         from '../models/News.model.js';
import Notification from '../models/Notification.model.js';
import ActivityLog  from '../models/ActivityLog.model.js';

// ─── Recommendations ─────────────────────────────────────────────────────────

/**
 * @desc   Recommend games related to a specific appid
 * @route  GET /api/v1/recommendations/games/:appid
 * @access Public
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const source = await Game.findOne({
    $or: [{ appid: req.params.appid }, { steamAppId: req.params.appid }],
  });
  if (!source) return res.status(404).json(ApiResponse.error('Game not found', 404));

  const related = await Game.find({
    _id: { $ne: source._id },
    $or: [
      { genre: { $in: source.genre || [] } },
      { genres: { $in: source.genres || [] } },
      { tags: { $in: source.tags || [] } },
    ],
  })
    .sort({ averageRating: -1 })
    .limit(10)
    .lean();

  res.status(200).json(ApiResponse.success('Game recommendations fetched', related));
});

// ─── Trending ─────────────────────────────────────────────────────────────────

/**
 * @desc   Fetch trending games (highest review count in last 30 days)
 * @route  GET /api/v1/trending/games
 * @access Public
 */
const getTrendingGames = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const games = await Game.find({ isArchived: { $ne: true } })
    .sort({ reviewCount: -1, averageRating: -1 })
    .limit(limit)
    .lean();

  res.status(200).json(ApiResponse.success('Trending games fetched', games));
});

// ─── News ─────────────────────────────────────────────────────────────────────

/**
 * @desc   Fetch latest gaming news
 * @route  GET /api/v1/news/latest
 * @access Public
 */
const getLatestNews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const news = await News.find({ isArchived: false })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('gameId', 'name headerImage')
    .lean();

  res.status(200).json(ApiResponse.success('Latest news fetched', news));
});

/**
 * @desc   Fetch trending gaming news (most recent active news with most tags)
 * @route  GET /api/v1/news/trending
 * @access Public
 */
const getTrendingNews = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const news = await News.aggregate([
    { $match: { isArchived: false } },
    { $addFields: { tagCount: { $size: '$tags' } } },
    { $sort: { tagCount: -1, publishedAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'games', localField: 'gameId', foreignField: '_id', as: 'game', pipeline: [{ $project: { name: 1, headerImage: 1 } }] } },
    { $unwind: { path: '$game', preserveNullAndEmpty: true } },
  ]);

  res.status(200).json(ApiResponse.success('Trending news fetched', news));
});

// ─── Compare ──────────────────────────────────────────────────────────────────

/**
 * @desc   Compare two games side-by-side
 * @route  GET /api/v1/compare/games/:id1/:id2
 * @access Public
 */
const compareGames = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.params;

  const [game1, game2] = await Promise.all([
    Game.findOne({ $or: [{ appid: id1 }, { steamAppId: id1 }] }).lean(),
    Game.findOne({ $or: [{ appid: id2 }, { steamAppId: id2 }] }).lean(),
  ]);

  if (!game1) return res.status(404).json(ApiResponse.error(`Game with id ${id1} not found`, 404));
  if (!game2) return res.status(404).json(ApiResponse.error(`Game with id ${id2} not found`, 404));

  const comparison = {
    game1: { name: game1.name, price: game1.price, rating: game1.averageRating, reviewCount: game1.reviewCount, platforms: game1.platforms, genres: game1.genres || game1.genre, tags: game1.tags, isFree: game1.isFree },
    game2: { name: game2.name, price: game2.price, rating: game2.averageRating, reviewCount: game2.reviewCount, platforms: game2.platforms, genres: game2.genres || game2.genre, tags: game2.tags, isFree: game2.isFree },
    winner: {
      price:  game1.price <= game2.price ? game1.name : game2.name,
      rating: game1.averageRating >= game2.averageRating ? game1.name : game2.name,
    },
  };

  res.status(200).json(ApiResponse.success('Game comparison fetched', comparison));
});

// ─── Timeline ─────────────────────────────────────────────────────────────────

/**
 * @desc   Fetch update timeline for a specific game
 * @route  GET /api/v1/timeline/game/:appid
 * @access Public
 */
const getTimeline = asyncHandler(async (req, res) => {
  const game = await Game.findOne({
    $or: [{ appid: req.params.appid }, { steamAppId: req.params.appid }],
  }).lean();

  if (!game) return res.status(404).json(ApiResponse.error('Game not found', 404));

  const timeline = (game.history || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.status(200).json(ApiResponse.success('Game timeline fetched', timeline));
});

// ─── Activity Logs ────────────────────────────────────────────────────────────

/**
 * @desc   Fetch authenticated user's activity logs
 * @route  GET /api/v1/activity/logs
 * @access Private
 */
const getActivityLogs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page  = parseInt(req.query.page)  || 1;
  const skip  = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ActivityLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ActivityLog.countDocuments({ userId: req.user._id }),
  ]);

  res.status(200).json(ApiResponse.success('Activity logs fetched', { logs, total, page, limit }));
});

// ─── Notifications ────────────────────────────────────────────────────────────

/**
 * @desc   Fetch authenticated user's notifications
 * @route  GET /api/v1/notifications
 * @access Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.status(200).json(ApiResponse.success('Notifications fetched', notifications));
});

/**
 * @desc   Mark a notification as read
 * @route  PATCH /api/v1/notifications/read/:id
 * @access Private
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) return res.status(404).json(ApiResponse.error('Notification not found', 404));
  res.status(200).json(ApiResponse.success('Notification marked as read', notification));
});

/**
 * @desc   Delete a notification
 * @route  DELETE /api/v1/notifications/:id
 * @access Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!notification) return res.status(404).json(ApiResponse.error('Notification not found', 404));
  res.status(200).json(ApiResponse.success('Notification deleted successfully'));
});

// ─── System ───────────────────────────────────────────────────────────────────

/**
 * @desc   Fetch API version info
 * @route  GET /api/v1/system/version
 * @access Public
 */
const getSystemVersion = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('API version info', {
    version:     '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    uptime:      `${Math.floor(process.uptime())}s`,
  }));
});

/**
 * @desc   Fetch system info
 * @route  GET /api/v1/system/info
 * @access Public
 */
const getSystemInfo = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('System info retrieved successfully', {
    platform:    process.platform,
    nodeVersion: process.version,
    uptime:      process.uptime(),
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  }));
});

export default {
  getRecommendations,
  getTrendingGames,
  getLatestNews,
  getTrendingNews,
  compareGames,
  getTimeline,
  getActivityLogs,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  getSystemVersion,
  getSystemInfo,
};
