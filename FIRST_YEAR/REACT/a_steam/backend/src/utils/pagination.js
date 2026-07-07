/**
 * Reusable Pagination Utility
 * Extracts page, limit, and skip from Express req.query
 *
 * @param {Object} query - Express req.query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPagination = (query) => {
  const page  = parseInt(query.page,  10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

export { getPagination };
