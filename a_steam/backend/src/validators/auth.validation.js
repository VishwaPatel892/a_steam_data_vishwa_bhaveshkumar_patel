import Joi from 'joi';

// ─── Register ────────────────────────────────────────────────────────────────
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required().messages({
    'string.min':  'Name must be at least 2 characters',
    'string.max':  'Name cannot exceed 60 characters',
    'any.required': 'Name is required',
  }),

  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(8).max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min':     'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'Password is required',
    }),
});

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// ─── Update Profile ──────────────────────────────────────────────────────────
export const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 60 characters',
  }),

  avatar: Joi.string().uri().allow('').messages({
    'string.uri': 'Avatar must be a valid URL',
  }),

  bio: Joi.string().max(300).allow('').messages({
    'string.max': 'Bio cannot exceed 300 characters',
  }),
}).min(1).messages({
  'object.min': 'Provide at least one field to update',
});

// ─── Change Password ─────────────────────────────────────────────────────────
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),

  newPassword: Joi.string().min(8).max(64)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base':
        'New password must contain at least one uppercase letter, one lowercase letter, and one number',
      'any.required': 'New password is required',
    }),
});
