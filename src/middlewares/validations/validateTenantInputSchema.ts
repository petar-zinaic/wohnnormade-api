import { Request, Response, NextFunction } from "express";

import { tenantInputSchema, tenantSearchQuerySchema } from './schemas/tenantSchemas';
import { InvalidRequestException, InvalidQueryException } from '@utility/exceptions';

export function validateTenantInput(req: Request, res: Response, next: NextFunction) {
  const { error, value } = tenantInputSchema.validate(req.body);

  if(error) throw new InvalidRequestException(error.details[0].message);

  // Use Joi's converted value so dateOfBirth reaches Prisma as a Date
  req.body = value;

  next();
}

export function validateTenantSearchQuery(req: Request, res: Response, next: NextFunction) {
  const { error } = tenantSearchQuerySchema.validate(req.query);

  if(error) throw new InvalidQueryException(error.details[0].message);

  next();
}
