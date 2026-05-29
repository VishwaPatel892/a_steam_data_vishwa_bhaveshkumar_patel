import Game from '../models/Game.model.js';
import Review from '../models/Review.model.js';

const getTopRatedGames = async (limit = 10) => {
  return Game.aggregate([
    { $match: { averageRating: { $gt: 0 } } },
    { $sort: { averageRating: -1 } },
    { $limit: limit },
    { $project: { name: 1, averageRating: 1, reviewCount: 1, headerImage: 1, releaseDate: 1 } },
  ]);
};

const getGenreDistribution = async () => {
  return Game.aggregate([
    { $unwind: "$genre" },
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $lookup: { from: "genres", localField: "_id", foreignField: "_id", as: "genreInfo" } },
    { $unwind: "$genreInfo" },
    { $project: { genreName: "$genreInfo.name", count: 1 } },
    { $sort: { count: -1 } },
  ]);
};

const getReviewSentiment = async () => {
  return Review.aggregate([
    {
      $group: {
        _id: "$game",
        totalReviews: { $sum: 1 },
        positive: { $sum: { $cond: ["$recommended", 1, 0] } },
        negative: { $sum: { $cond: ["$recommended", 0, 1] } },
        avgRating: { $avg: "$rating" },
      },
    },
    { $lookup: { from: "games", localField: "_id", foreignField: "_id", as: "game" } },
    { $unwind: "$game" },
    {
      $project: {
        gameName: "$game.name",
        totalReviews: 1,
        positive: 1,
        negative: 1,
        avgRating: { $round: ["$avgRating", 2] },
        positiveRatio: { $round: [{ $divide: ["$positive", "$totalReviews"] }, 2] },
      },
    },
    { $sort: { totalReviews: -1 } },
    { $limit: 50 },
  ]);
};

const getReleasesPerYear = async () => {
  return Game.aggregate([
    { $match: { releaseDate: { $exists: true } } },
    { $group: { _id: { $year: "$releaseDate" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { year: "$_id", count: 1, _id: 0 } },
  ]);
};

const getPublisherStats = async () => {
  return Game.aggregate([
    { $unwind: "$publisher" },
    {
      $group: {
        _id: "$publisher",
        totalGames: { $sum: 1 },
        avgRating: { $avg: "$averageRating" },
        totalReviews: { $sum: "$reviewCount" },
      },
    },
    { $lookup: { from: "publishers", localField: "_id", foreignField: "_id", as: "publisherInfo" } },
    { $unwind: "$publisherInfo" },
    {
      $project: {
        publisherName: "$publisherInfo.name",
        totalGames: 1,
        avgRating: { $round: ["$avgRating", 2] },
        totalReviews: 1,
      },
    },
    { $sort: { totalGames: -1 } },
    { $limit: 20 },
  ]);
};

export default {  getTopRatedGames, getGenreDistribution, getReviewSentiment, getReleasesPerYear, getPublisherStats  };
