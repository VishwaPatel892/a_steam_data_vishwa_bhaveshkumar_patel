const Review = require("../models/Review.model");
const Game = require("../models/Game.model");

const getReviewsByGame = async (gameId, { skip, limit, page }) => {
  const [reviews, total] = await Promise.all([
    Review.find({ game: gameId })
      .populate("user", "name avatar")
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ game: gameId }),
  ]);
  return { reviews, total, page, limit, pages: Math.ceil(total / limit) };
};

const createReview = async (userId, gameId, { rating, content, recommended }) => {
  const game = await Game.findById(gameId);
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  const existing = await Review.findOne({ user: userId, game: gameId });
  if (existing) {
    const error = new Error("You have already reviewed this game");
    error.statusCode = 409;
    throw error;
  }
  return Review.create({ user: userId, game: gameId, rating, content, recommended });
};

const updateReview = async (reviewId, userId, data) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) {
    const error = new Error("Review not found or not authorised");
    error.statusCode = 404;
    throw error;
  }
  Object.assign(review, data);
  await review.save();
  return review;
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
  if (!review) {
    const error = new Error("Review not found or not authorised");
    error.statusCode = 404;
    throw error;
  }
};

module.exports = { getReviewsByGame, createReview, updateReview, deleteReview };
