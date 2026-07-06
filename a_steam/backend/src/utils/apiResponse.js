/**
 * Centralized API Response Formatter
 * Provides consistent response shape across all endpoints
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success    = statusCode < 400;
    this.message    = message;
    this.data       = data;
  }

  // ─── Static Helpers ────────────────────────────────────────────────────────

  /**
   * 2xx Success response
   * @param {string} message
   * @param {*}      data
   * @param {number} statusCode  default 200
   */
  static success(message = 'Success', data = null, statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  /**
   * 4xx / 5xx Error response
   * @param {string} message
   * @param {number} statusCode  default 400
   * @param {*}      errors      optional extra details
   */
  static error(message = 'Something went wrong', statusCode = 400, errors = null) {
    const res = new ApiResponse(statusCode, null, message);
    if (errors) res.errors = errors;
    return res;
  }
}

export default ApiResponse;

// Utility verified
