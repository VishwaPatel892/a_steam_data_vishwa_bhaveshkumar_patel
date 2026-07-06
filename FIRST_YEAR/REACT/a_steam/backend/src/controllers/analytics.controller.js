import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import analyticsService from '../services/analytics.service.js';

const getTopRatedGames       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Top rated games', await analyticsService.getTopRatedGames(parseInt(req.query.limit) || 10))));
const getMostDownloaded      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Most downloaded games', await analyticsService.getMostDownloaded(parseInt(req.query.limit) || 10))));
const getRevenue             = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Revenue analysis', await analyticsService.getRevenueAnalysis(parseInt(req.query.limit) || 20))));
const getPlatformDistribution= asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Platform distribution', await analyticsService.getPlatformDistribution())));
const getGenreDistribution   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Genre distribution', await analyticsService.getGenreDistribution())));
const getTrending            = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Trending games', await analyticsService.getTrendingGames(parseInt(req.query.limit) || 10))));
const getReleaseTrends       = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Release trends', await analyticsService.getReleaseTrends())));
const getUserActivity        = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('User activity', await analyticsService.getUserActivity(parseInt(req.query.limit) || 50))));
const getWishlistAnalysis    = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Wishlist analysis', await analyticsService.getWishlistAnalysis())));
const getReviewAnalysis      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Review analysis', await analyticsService.getReviewAnalysis())));
const getPublisherStats      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Publisher stats', await analyticsService.getPublisherStats())));
const getReleasesPerYear     = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Releases per year', await analyticsService.getReleasesPerYear())));
const getReviewSentiment     = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Review sentiment', await analyticsService.getReviewSentiment())));

export default {
  getTopRatedGames, getMostDownloaded, getRevenue, getPlatformDistribution,
  getGenreDistribution, getTrending, getReleaseTrends, getUserActivity,
  getWishlistAnalysis, getReviewAnalysis, getPublisherStats, getReleasesPerYear,
  getReviewSentiment,
};
