const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const gameService = require("../services/game.service");
const { getPagination } = require("../utils/pagination");

/**
 * @desc    Get all games with filters & pagination
 * @route   GET /api/v1/games
 * @access  Public
 */
const getAllGames = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const result = await gameService.getAllGames(req.query, pagination);
  res.status(200).json(apiResponse.success("Games fetched successfully", result));
});

/**
 * @desc    Get a single game by ID
 * @route   GET /api/v1/games/:id
 * @access  Public
 */
const getGameById = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.id);
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
 * @route   PUT /api/v1/games/:id
 * @access  Private/Admin
 */
const updateGame = asyncHandler(async (req, res) => {
  const game = await gameService.updateGame(req.params.id, req.body);
  res.status(200).json(apiResponse.success("Game updated successfully", game));
});

/**
 * @desc    Delete a game
 * @route   DELETE /api/v1/games/:id
 * @access  Private/Admin
 */
const deleteGame = asyncHandler(async (req, res) => {
  await gameService.deleteGame(req.params.id);
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

module.exports = { getAllGames, getGameById, createGame, updateGame, deleteGame, searchGames };
