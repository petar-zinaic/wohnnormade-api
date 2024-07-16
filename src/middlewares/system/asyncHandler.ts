import { Request, Response, NextFunction } from "express";

export default function asyncHandler(controllerFunction: Function){
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(controllerFunction(req, res, next)).catch(next);
    }
}
