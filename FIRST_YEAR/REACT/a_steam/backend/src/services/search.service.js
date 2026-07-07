import Game from '../models/Game.model.js';

/**
 * Full-text search across name, tags, genres, developer, description.
 * Supports pagination.
 */
const searchGames = async (q, queryString) => {
  if (!q || !q.trim()) {
    return { games: [], total: 0, page: 1, limit: 10, pages: 0 };
  }

  const page  = parseInt(queryString.page) || 1;
  const limit = parseInt(queryString.limit) || 10;
  const skip  = (page - 1) * limit;

  const regex = new RegExp(q.trim(), 'i');
  const filter = {
    isArchived: { $ne: true },
    $or: [
      { name: regex },
      { tags: { $in: [regex] } },
      { genre: { $in: [regex] } },
      { genres: { $in: [regex] } },
      { developer: { $in: [regex] } },
      { description: regex },
      { shortDescription: regex },
    ],
  };

  const [games, total] = await Promise.all([
    Game.find(filter)
      .sort({ reviewCount: -1, averageRating: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Game.countDocuments(filter),
  ]);

  return { games, total, page, limit, pages: Math.ceil(total / limit), query: q };
};

export default { searchGames };
