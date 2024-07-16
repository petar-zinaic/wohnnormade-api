import { Request, Response, NextFunction } from "express";

import { InvalidIdException } from "@exceptions";

import { uuidSchema } from "./schemas/sharedSchemas";

export function validateUUIDParam(req: Request, res: Response, next: NextFunction){
    const { error } = uuidSchema.validate(req.params.id);

    if(error) throw new InvalidIdException();

    next();
}
