const Game = require("../models/Game.model");
const { buildFilter } = require("../utils/filterBuilder");

const getAllGames = async (query, { page, limit, skip }) => {
  const filter = buildFilter(query, ["genre", "developer", "publisher"]);
  const [games, total] = await Promise.all([
    Game.find(filter)
      .populate("genre developer publisher", "name")
      .skip(skip)
      .limit(limit)
      .lean(),
    Game.countDocuments(filter),
  ]);
  return { games, total, page, limit, pages: Math.ceil(total / limit) };
};

const getGameById = async (id) => {
  const game = await Game.findById(id)
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

const updateGame = async (id, data) => {
  const game = await Game.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!game) {
    const error = new Error("Game not found");
    error.statusCode = 404;
    throw error;
  }
  return game;
};

const deleteGame = async (id) => {
  const game = await Game.findByIdAndDelete(id);
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
  })
    .limit(20)
    .lean();
};

module.exports = { getAllGames, getGameById, createGame, updateGame, deleteGame, searchGames };
