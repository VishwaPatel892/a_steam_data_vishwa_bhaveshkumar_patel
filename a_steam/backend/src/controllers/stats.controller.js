import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import statsService from '../services/stats.service.js';

const countGames         = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Total game count', await statsService.countGames())));
const getTopRated        = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Top-rated games', await statsService.getTopRated(req.query))));
const getMostDownloaded  = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Most downloaded games', await statsService.getMostDownloaded(req.query))));
const getAveragePrice    = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Average game price', await statsService.getAveragePrice())));
const getAverageRating   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Average game rating', await statsService.getAverageRating())));
const getGenreCount      = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Game count by genre', await statsService.getGenreCount())));
const getPlatformCount   = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Game count by platform', await statsService.getPlatformCount())));
const getFreeToPlayCount = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Free-to-play count', await statsService.getFreeToPlayCount())));
const getMultiplayerCount= asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Multiplayer game count', await statsService.getMultiplayerCount())));
const getMonthlyReleases = asyncHandler(async (req, res) => res.status(200).json(apiResponse.success('Monthly release stats', await statsService.getMonthlyReleases())));

export default {
  countGames, getTopRated, getMostDownloaded, getAveragePrice, getAverageRating,
  getGenreCount, getPlatformCount, getFreeToPlayCount, getMultiplayerCount, getMonthlyReleases,
};
