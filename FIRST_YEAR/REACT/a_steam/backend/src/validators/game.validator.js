import Joi from 'joi';

const createGameSchema = Joi.object({
  appid: Joi.number().integer().optional(),
  steamAppId: Joi.number().integer().min(1).optional(),
  name: Joi.string().trim().required().messages({
    "string.empty": "Game name is required",
    "any.required": "Game name is required",
  }),
  description: Joi.string().allow("").optional(),
  shortDescription: Joi.string().max(500).allow("").optional(),
  headerImage: Joi.string().uri().allow("").optional(),
  releaseDate: Joi.date().iso().optional(),
  release_date: Joi.string().allow("").optional(),
  release_year: Joi.any().optional(),
  developer: Joi.array().items(Joi.string()).optional(),
  publisher: Joi.array().items(Joi.string()).optional(),
  genre: Joi.array().items(Joi.string()).optional(),
  genres: Joi.array().items(Joi.string()).optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  recommendations: Joi.any().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  platforms: Joi.object({
    windows: Joi.boolean().optional(),
    mac: Joi.boolean().optional(),
    linux: Joi.boolean().optional(),
  }).optional(),
  price: Joi.number().min(0).optional(),
  isFree: Joi.boolean().optional(),
  averageRating: Joi.number().min(0).max(5).optional(),
  reviewCount: Joi.number().integer().min(0).optional(),
  metacriticScore: Joi.number().integer().min(0).max(100).optional(),
  website: Joi.string().uri().allow("").optional(),
});

const updateGameSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().allow("").optional(),
  shortDescription: Joi.string().max(500).allow("").optional(),
  headerImage: Joi.string().uri().allow("").optional(),
  releaseDate: Joi.date().iso().optional(),
  release_date: Joi.string().allow("").optional(),
  release_year: Joi.any().optional(),
  developer: Joi.array().items(Joi.string()).optional(),
  publisher: Joi.array().items(Joi.string()).optional(),
  genre: Joi.array().items(Joi.string()).optional(),
  genres: Joi.array().items(Joi.string()).optional(),
  categories: Joi.array().items(Joi.string()).optional(),
  recommendations: Joi.any().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  platforms: Joi.object({
    windows: Joi.boolean().optional(),
    mac: Joi.boolean().optional(),
    linux: Joi.boolean().optional(),
  }).optional(),
  price: Joi.number().min(0).optional(),
  isFree: Joi.boolean().optional(),
  averageRating: Joi.number().min(0).max(5).optional(),
  reviewCount: Joi.number().integer().min(0).optional(),
  metacriticScore: Joi.number().integer().min(0).max(100).optional(),
  website: Joi.string().uri().allow("").optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

export { 
  createGameSchema,
  updateGameSchema,
 };
