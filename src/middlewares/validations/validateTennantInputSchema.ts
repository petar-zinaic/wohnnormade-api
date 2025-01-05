import { Request, Response, NextFunction } from "express";

import { tennantInputSchema } from './schemas/tennantSchemas';
import { InvalidCreateTennantBodyException } from '@utility/exceptions';

export function validateTennantInput(req: Request, res: Response, next: NextFunction) {
  const { error } = tennantInputSchema.validate(req.body);

  if(error) throw new InvalidCreateTennantBodyException(error.details[0].message);

  next();
}
