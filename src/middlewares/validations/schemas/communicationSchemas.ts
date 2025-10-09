import Joi from 'joi';

export const contactReporterSchema = Joi.object({
  tenantId: Joi.number().integer().positive().required(),
  recipientId: Joi.number().integer().positive().required(),
  message: Joi.string().min(20).max(2000).required()
});

export const replyToThreadSchema = Joi.object({
  threadId: Joi.string().required(),
  message: Joi.string().min(20).max(2000).required()
});

export const getThreadSchema = Joi.object({
  threadId: Joi.string().required()
});
