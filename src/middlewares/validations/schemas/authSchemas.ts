import Joi from "joi";
import { emailSchema } from "./sharedSchemas";

export const registerSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must not exceed 50 characters",
  }),
  name: Joi.string().max(100).optional(),
  surname: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
});

export const loginSchema = Joi.object({
  email: emailSchema.required(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(50).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password must not exceed 50 characters",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().hex().length(64).required().messages({
    "string.hex": "Reset token is invalid",
    "string.length": "Reset token is invalid",
  }),
  newPassword: Joi.string().min(6).max(50).required().messages({
    "string.min": "New password must be at least 6 characters long",
    "string.max": "New password must not exceed 50 characters",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: emailSchema.required(),
});
