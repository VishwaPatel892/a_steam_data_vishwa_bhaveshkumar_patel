import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

/**
 * Generates a signed JWT for the given user ID.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT string
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export default generateToken;
