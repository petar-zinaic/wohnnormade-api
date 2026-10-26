import Joi from "joi";
import { emailSchema } from "./sharedSchemas";

export const updateUserSchema = Joi.object({
  email: emailSchema.optional(),
  name: Joi.string().max(100).optional(),
  surname: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
});

export const userIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
