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
