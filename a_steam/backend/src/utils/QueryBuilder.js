/**
 * Advanced Mongoose Query Builder
 * 
 * Handles dynamic filtering, sorting, field projection, and pagination
 * based on standard query string parameters.
 */
class QueryBuilder {
  /**
   * @param {Object} mongooseQuery - Mongoose query object (e.g. Model.find())
   * @param {Object} queryString - Express req.query object
   */
  constructor(mongooseQuery, queryString) {
    this.query = mongooseQuery;
    this.queryString = queryString;
  }

  /**
   * 1. Filtering
   * Parses $gt, $gte, $lt, $lte, $in and exact matches.
   * Also handles regex searching for the "search" keyword.
   */
  filter() {
    const queryObj = { ...this.queryString };
    
    // Exclude special fields from standard filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1A. Advanced filtering (gt, gte, lt, lte, in)
    // Convert { price: { gte: '10' } } -> { price: { $gte: '10' } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);
    
    const parsedQuery = JSON.parse(queryStr);

    // 1B. Regex Search implementation
    if (this.queryString.search) {
      // Assuming a generic search across 'name' field if not specified otherwise
      parsedQuery.name = { $regex: this.queryString.search, $options: 'i' };
    }

    this.query = this.query.find(parsedQuery);
    return this;
  }

  /**
   * 2. Sorting
   * Sorts based on `sort` param (comma separated). Default is descending createdAt.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // Default sort
    }
    return this;
  }

  /**
   * 3. Field Projection
   * Selects specific fields to return.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Default: exclude internal version key
    }
    return this;
  }

  /**
   * 4. Pagination
   * Limits results based on page and limit parameters.
   */
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    
    // Attach pagination info for the controller to use
    this.paginationMeta = {
      page,
      limit,
      skip
    };

    return this;
  }
}

export default QueryBuilder;

// Utility verified
