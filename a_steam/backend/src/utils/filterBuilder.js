const mongoose = require("mongoose");

/**
 * Builds a Mongoose filter object from query parameters.
 * Accepts ObjectId fields, numeric ranges, and boolean flags.
 *
 * @param {Object} query       - req.query object
 * @param {string[]} refFields - Fields that are ObjectId references (e.g. ["genre", "developer"])
 * @returns {Object} Mongoose-compatible filter object
 */
const buildFilter = (query, refFields = []) => {
  const filter = {};

  // ObjectId reference fields
  refFields.forEach((field) => {
    if (query[field] && mongoose.Types.ObjectId.isValid(query[field])) {
      filter[field] = query[field];
    }
  });

  // Price range
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice !== undefined) filter.price.$lte = parseFloat(query.maxPrice);
  }

  // Free games
  if (query.isFree !== undefined) {
    filter.isFree = query.isFree === "true";
  }

  // Platform filter
  if (query.platform) {
    filter[`platforms.${query.platform}`] = true;
  }

  // Minimum average rating
  if (query.minRating !== undefined) {
    filter.averageRating = { $gte: parseFloat(query.minRating) };
  }

  return filter;
};

module.exports = { buildFilter };
