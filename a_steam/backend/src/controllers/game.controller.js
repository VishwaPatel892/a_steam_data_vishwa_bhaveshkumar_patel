import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import gameService from '../services/game.service.js';

/**
 * @desc    Get all games with filters & pagination
 * @route   GET /api/v1/games
 * @access  Public
 */
const getAllGames = asyncHandler(async (req, res) => {
  const result = await gameService.getAllGames(req.query);
  res.status(200).json(apiResponse.success("Games fetched successfully", result));
});

/**
 * @desc    Get a random game
 * @route   GET /api/v1/games/random
 * @access  Public
 */
const getRandomGame = asyncHandler(async (req, res) => {
  const game = await gameService.getRandomGame();
  res.status(200).json(apiResponse.success("Random game fetched successfully", game));
});

/**
 * @desc    Get a single game by appid
 * @route   GET /api/v1/games/:appid
 * @access  Public
 */
const getGameById = asyncHandler(async (req, res) => {
  const game = await gameService.getGameByAppId(req.params.appid);
  res.status(200).json(apiResponse.success("Game fetched successfully", game));
});

/**
 * @desc    Create a new game
 * @route   POST /api/v1/games
 * @access  Private/Admin
 */
const createGame = asyncHandler(async (req, res) => {
  const game = await gameService.createGame(req.body);
  res.status(201).json(apiResponse.success("Game created successfully", game));
});

/**
 * @desc    Update a game
 * @route   PUT /api/v1/games/:appid
 * @route   PATCH /api/v1/games/:appid
 * @access  Private/Admin
 */
const updateGame = asyncHandler(async (req, res) => {
  const game = await gameService.updateGameByAppId(req.params.appid, req.body);
  res.status(200).json(apiResponse.success("Game updated successfully", game));
});

/**
 * @desc    Delete a game
 * @route   DELETE /api/v1/games/:appid
 * @access  Private/Admin
 */
const deleteGame = asyncHandler(async (req, res) => {
  await gameService.deleteGameByAppId(req.params.appid);
  res.status(200).json(apiResponse.success("Game deleted successfully"));
});

/**
 * @desc    Search games by name or tag
 * @route   GET /api/v1/games/search
 * @access  Public
 */
const searchGames = asyncHandler(async (req, res) => {
  const games = await gameService.searchGames(req.query.q);
  res.status(200).json(apiResponse.success("Search results fetched", games));
});

/**
 * @desc    Get game summary
 * @route   GET /api/v1/games/:appid/summary
 * @access  Public
 */
const getSummary = asyncHandler(async (req, res) => {
  const summary = await gameService.getSummary(req.params.appid);
  res.status(200).json(apiResponse.success("Game summary fetched", summary));
});

/**
 * @desc    Get game history
 * @route   GET /api/v1/games/:appid/history
 * @access  Private/Admin
 */
const getHistory = asyncHandler(async (req, res) => {
  const history = await gameService.getHistory(req.params.appid);
  res.status(200).json(apiResponse.success("Game history fetched", history));
});

/**
 * @desc    Archive a game
 * @route   PATCH /api/v1/games/:appid/archive
 * @access  Private/Admin
 */
const archiveGame = asyncHandler(async (req, res) => {
  const game = await gameService.archiveGame(req.params.appid);
  res.status(200).json(apiResponse.success("Game archived successfully", game));
});

/**
 * @desc    Restore an archived game
 * @route   PATCH /api/v1/games/:appid/restore
 * @access  Private/Admin
 */
const restoreGame = asyncHandler(async (req, res) => {
  const game = await gameService.restoreGame(req.params.appid);
  res.status(200).json(apiResponse.success("Game restored successfully", game));
});

export default {  
  getAllGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame, 
  searchGames,
  getRandomGame,
  getSummary,
  getHistory,
  archiveGame,
  restoreGame
 };
