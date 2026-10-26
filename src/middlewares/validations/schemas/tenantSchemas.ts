import Joi from "joi";

export const tenantInputSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
  violationType: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
});

export const updateTenantInputSchema = Joi.object({
  name: Joi.string().optional(),
  surname: Joi.string().optional(),
  dateOfBirth: Joi.date().optional(),
  violationType: Joi.string().optional(),
  description: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
}).min(1); // At least one field must be provided for update

export const tenantSearchQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).max(200).required().messages({
    "any.required": "Search query parameter 'q' is required",
    "string.empty": "Search query parameter 'q' is required",
  }),
  dateOfBirth: Joi.date().iso().optional().messages({
    "date.format": "dateOfBirth must be an ISO date (YYYY-MM-DD)",
  }),
});
