import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MissingTokenException } from "@utility/exceptions";
import { AuthRequest } from "@requestType";
import envConfig from "@config/environment";

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    throw new MissingTokenException();
  }

  try {
    const decoded = jwt.verify(token, envConfig.auth.jwtSecret) as { userId: number };
    req.userId = decoded.userId;
  } catch (error) {
    throw new MissingTokenException();
  }

  next();
};
