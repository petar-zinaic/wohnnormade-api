import { NextFunction, Request, Response } from "express";

import ResponseHandler from "@utility/handlers/ResponseHandler";

import { InvalidRequestException } from "@exceptions";

const responseHandler = new ResponseHandler();

export default function errorHandler(error: Error & { type?: string }, req: Request, res: Response, next: NextFunction) {
    // body-parser rejects malformed JSON before it reaches validation
    if (error.type === "entity.parse.failed") {
        return responseHandler.processError(new InvalidRequestException("Malformed JSON body."), res);
    }

    responseHandler.processError(error, res);
}
