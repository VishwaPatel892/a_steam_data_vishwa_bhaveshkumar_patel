import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

/**
 * Sign a JWT for the given userId
 * @param {string} userId  - MongoDB ObjectId
 * @returns {string}       - signed JWT
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Verify and decode a JWT
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 * @throws on expired / invalid token
 */
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

/**
 * Decode WITHOUT verifying signature (useful for reading exp without throwing)
 * @param {string} token
 */
const decodeToken = (token) => jwt.decode(token);

export { generateToken, verifyToken, decodeToken };
export default generateToken;
