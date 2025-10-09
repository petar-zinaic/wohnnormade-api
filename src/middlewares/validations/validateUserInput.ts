import { Request, Response, NextFunction } from "express";
import { updateUserSchema, userIdSchema } from "./schemas/userSchemas";
import { InvalidCreateTennantBodyException } from "@utility/exceptions";

export const validateUpdateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userIdSchema.validate(req.params);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};
