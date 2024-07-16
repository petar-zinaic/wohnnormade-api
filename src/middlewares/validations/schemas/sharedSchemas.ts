import Joi from "joi";

export const uuidSchema = Joi.string().guid({ version: "uuidv4" }).required();
export const emailSchema = Joi.string().email({ minDomainSegments: 2, tlds: false });
