import { Request, Response, NextFunction } from "express";

import { updateTenantInputSchema } from "./schemas/tenantSchemas";
import { InvalidRequestException } from "@utility/exceptions";

export function validateUpdateTenantInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error, value } = updateTenantInputSchema.validate(req.body);

  if (error)
    throw new InvalidRequestException(error.details[0].message);

  // Use Joi's converted value so dateOfBirth reaches Prisma as a Date
  req.body = value;

  next();
}
