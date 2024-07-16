import { NextFunction, Request, Response } from "express";

import ResponseHandler from "@utility/handlers/ResponseHandler";

import { HttpException } from "@exceptions";

const responseHandler = new ResponseHandler();

export default function errorHandler(error: HttpException, req: Request, res: Response, next: NextFunction) {
    responseHandler.processError(error, res);
}
