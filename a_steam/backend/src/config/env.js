import dotenv from 'dotenv';
dotenv.config();

export const PORT            = process.env.PORT            || 5000;
export const MONGODB_URI     = process.env.MONGODB_URI     || 'mongodb://localhost:27017/a_steam';
export const NODE_ENV        = process.env.NODE_ENV        || 'development';
export const JWT_SECRET      = process.env.JWT_SECRET      || 'changeme_super_secret';
export const JWT_EXPIRES_IN  = process.env.JWT_EXPIRES_IN  || '30d';
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
export const CORS_ORIGIN     = process.env.CORS_ORIGIN     || '*';
