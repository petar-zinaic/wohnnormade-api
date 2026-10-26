import { Request, Response, NextFunction } from "express";

import { InvalidIdException, InvalidRequestException } from "@exceptions";

import { uuidSchema, numericIdSchema } from "./schemas/sharedSchemas";

export function validateUUIDParam(req: Request, res: Response, next: NextFunction){
    const { error } = uuidSchema.validate(req.params.id);

    if(error) throw new InvalidIdException();

    next();
}

export function validateNumericIdParam(req: Request, res: Response, next: NextFunction){
    const { error } = numericIdSchema.validate(req.params.id);

    if(error) throw new InvalidRequestException("ID must be a positive integer.");

    next();
}
