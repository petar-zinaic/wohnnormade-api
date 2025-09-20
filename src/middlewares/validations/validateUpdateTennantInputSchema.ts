import { Request, Response, NextFunction } from "express";

import { updateTennantInputSchema } from "./schemas/tennantSchemas";
import { InvalidCreateTennantBodyException } from "@utility/exceptions";

export function validateUpdateTennantInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = updateTennantInputSchema.validate(req.body);

  if (error)
    throw new InvalidCreateTennantBodyException(error.details[0].message);

  next();
}
