const apiResponse = require("../utils/apiResponse");

/**
 * Validates req.body against a Joi schema.
 * @param {Object} schema - Joi schema
 */
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message.replace(/"/g, "'")).join(", ");
    return res.status(422).json(apiResponse.error(messages, 422));
  }
  next();
};

/**
 * Validates req.query against a Joi schema.
 * @param {Object} schema - Joi schema
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message.replace(/"/g, "'")).join(", ");
    return res.status(422).json(apiResponse.error(messages, 422));
  }
  next();
};

module.exports = { validateBody, validateQuery };
