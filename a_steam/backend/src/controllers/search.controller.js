import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';
import searchService from '../services/search.service.js';

/** GET /api/v1/search/games?q=... */
const searchGames = asyncHandler(async (req, res) => {
  const result = await searchService.searchGames(req.query.q, req.query);
  res.status(200).json(apiResponse.success('Search results fetched', result));
});

export default { searchGames };
