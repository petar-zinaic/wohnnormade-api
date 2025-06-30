import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from "./schemas/authSchemas";
import { InvalidCreateTennantBodyException } from "@utility/exceptions";

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};

export const validateChangePasswordInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = changePasswordSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};

export const validateResetPasswordInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};

export const validateForgotPasswordInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = forgotPasswordSchema.validate(req.body);

  if (error) {
    throw new InvalidCreateTennantBodyException(error.details[0].message);
  }

  next();
};
