const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const reviewService = require("../services/review.service");
const { getPagination } = require("../utils/pagination");

/**
 * @desc    Get all reviews for a game
 * @route   GET /api/v1/reviews/game/:gameId
 * @access  Public
 */
const getReviewsByGame = asyncHandler(async (req, res) => {
  const pagination = getPagination(req.query);
  const reviews = await reviewService.getReviewsByGame(req.params.gameId, pagination);
  res.status(200).json(apiResponse.success("Reviews fetched successfully", reviews));
});

/**
 * @desc    Create a review for a game
 * @route   POST /api/v1/reviews/game/:gameId
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.gameId, req.body);
  res.status(201).json(apiResponse.success("Review submitted successfully", review));
});

/**
 * @desc    Update own review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
  res.status(200).json(apiResponse.success("Review updated successfully", review));
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user.id);
  res.status(200).json(apiResponse.success("Review deleted successfully"));
});

module.exports = { getReviewsByGame, createReview, updateReview, deleteReview };
