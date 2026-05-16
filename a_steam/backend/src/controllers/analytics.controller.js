const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const analyticsService = require("../services/analytics.service");

/**
 * @desc    Get top-rated games
 * @route   GET /api/v1/analytics/top-rated
 * @access  Public
 */
const getTopRatedGames = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const data = await analyticsService.getTopRatedGames(limit);
  res.status(200).json(apiResponse.success("Top rated games fetched", data));
});

/**
 * @desc    Get genre distribution
 * @route   GET /api/v1/analytics/genre-distribution
 * @access  Public
 */
const getGenreDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getGenreDistribution();
  res.status(200).json(apiResponse.success("Genre distribution fetched", data));
});

/**
 * @desc    Get review sentiment summary
 * @route   GET /api/v1/analytics/review-sentiment
 * @access  Public
 */
const getReviewSentiment = asyncHandler(async (req, res) => {
  const data = await analyticsService.getReviewSentiment();
  res.status(200).json(apiResponse.success("Review sentiment data fetched", data));
});

/**
 * @desc    Get games released per year
 * @route   GET /api/v1/analytics/releases-per-year
 * @access  Public
 */
const getReleasesPerYear = asyncHandler(async (req, res) => {
  const data = await analyticsService.getReleasesPerYear();
  res.status(200).json(apiResponse.success("Releases per year fetched", data));
});

/**
 * @desc    Get publisher performance stats
 * @route   GET /api/v1/analytics/publisher-stats
 * @access  Public
 */
const getPublisherStats = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPublisherStats();
  res.status(200).json(apiResponse.success("Publisher stats fetched", data));
});

module.exports = { getTopRatedGames, getGenreDistribution, getReviewSentiment, getReleasesPerYear, getPublisherStats };
