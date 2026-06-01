import Game from '../models/Game.model.js';
import '../models/Developer.model.js';
import '../models/Publisher.model.js';
import '../models/Genre.model.js';
import QueryBuilder from '../utils/QueryBuilder.js';

const getAllGames = async (queryString) => {
  // 1. Build main query for fetching documents
  const features = new QueryBuilder(Game.find({ isArchived: { $ne: true } }), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2. Build identical query just for counting total documents (skipping pagination)
  const countFeatures = new QueryBuilder(Game.find({ isArchived: { $ne: true } }), queryString).filter();

  const [games, total] = await Promise.all([
    features.query.populate("genre developer publisher", "name slug").lean(),
    countFeatures.query.countDocuments()
  ]);

  const { page, limit } = features.paginationMeta;

  return { 
    games, 
    total, 
    page, 
    limit, 
    pages: Math.ceil(total / limit) 
  };
};

const getGameByAppId = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid })
    .populate("genre developer publisher", "name")
    .lean();
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game;
};

const createGame = async (data) => {
  return Game.create(data);
};

const updateGameByAppId = async (appid, data) => {
  const updateData = { ...data };
  
  // Track update in history
  const historyEntry = {
    action: "UPDATE",
    details: "Game details updated",
  };

  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { $set: updateData, $push: { history: historyEntry } },
    { new: true, runValidators: true }
  );

  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game;
};

const deleteGameByAppId = async (appid) => {
  const game = await Game.findOneAndDelete({ steamAppId: appid });
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
};

const searchGames = async (query) => {
  if (!query) return [];
  return Game.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
    isArchived: { $ne: true }
  })
    .limit(20)
    .lean();
};

const getSummary = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid })
    .populate("genre", "name")
    .lean();
    
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }

  // Calculate summary metrics
  return {
    steamAppId: game.steamAppId,
    name: game.name,
    price: game.price,
    isFree: game.isFree,
    reviewCount: game.reviewCount,
    genres: game.genre.map(g => g.name),
    revenueEstimate: game.price * game.reviewCount * 30, // Rough estimate algorithm
  };
};

const getHistory = async (appid) => {
  const game = await Game.findOne({ steamAppId: appid }).select('history').lean();
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game.history || [];
};

const archiveGame = async (appid) => {
  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { 
      $set: { isArchived: true },
      $push: { history: { action: "ARCHIVE", details: "Game was archived" } }
    },
    { new: true }
  );
  
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game;
};

const restoreGame = async (appid) => {
  const game = await Game.findOneAndUpdate(
    { steamAppId: appid },
    { 
      $set: { isArchived: false },
      $push: { history: { action: "RESTORE", details: "Game was restored" } }
    },
    { new: true }
  );
  
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game;
};

const getRandomGame = async () => {
  const games = await Game.aggregate([
    { $match: { isArchived: { $ne: true } } },
    { $sample: { size: 1 } }
  ]);
  
  if (!games || games.length === 0) {
    const error = new Error("No games available");
    error.statusCode = 404;
    throw error;
  }
  return games[0];
};

export default {  
  getAllGames, 
  getGameByAppId, 
  createGame, 
  updateGameByAppId, 
  deleteGameByAppId, 
  searchGames,
  getSummary,
  getHistory,
  archiveGame,
  restoreGame,
  getRandomGame
 };
