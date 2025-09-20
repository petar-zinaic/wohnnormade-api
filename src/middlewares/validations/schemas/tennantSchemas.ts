import Joi from "joi";

export const tennantInputSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  violationType: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
});

export const updateTennantInputSchema = Joi.object({
  name: Joi.string().optional(),
  surname: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  violationType: Joi.string().optional(),
  description: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
}).min(1); // At least one field must be provided for update
