import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MissingTokenException } from "@utility/exceptions";

interface AuthRequest extends Request {
  userId?: number;
}

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
    const secret = process.env.JWT_SECRET || "your-default-secret-key";
    const decoded = jwt.verify(token, secret) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new MissingTokenException();
  }
};
