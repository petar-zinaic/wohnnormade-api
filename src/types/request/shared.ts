import { Request } from "express";

export interface PaginationOption {
    take: number;
    skip: number;
}

// Set by authenticateToken middleware
export interface AuthRequest extends Request {
    userId?: number;
}
