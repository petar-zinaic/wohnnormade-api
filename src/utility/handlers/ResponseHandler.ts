import { HttpException } from "@exceptions";
import { ErrorLogger } from "@utility/logger";

import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

import {
    ResponseDTO,
    ErrorResponseDTO,
    HttpExceptionDTO,
} from "@responseType";
import { Response } from "express";

export default class ResponseHandler {
    private errorLogger: ErrorLogger;

    constructor(){
        this.errorLogger = new ErrorLogger();
    }

    public processError(error: Error, res: Response){
        this.logError(error);

        // Unknown errors (Prisma, runtime) must not leak internal details to the client
        const httpError = error instanceof HttpException
            ? error
            : new HttpException({
                status: HTTP_STATUS.INTERNAL,
                message: "Internal server error.",
                internal_code: INTERNAL_CODE.UNHANDLED_EXCEPTION,
            });

        res.status(httpError.status || HTTP_STATUS.INTERNAL).send(this.formatErrorResponse(httpError));
    }

    public processResponse<ResultType>(res: Response, data?: ResultType) {
      const response = this.formatResponse(data);
      const responseStatus = response.result ? HTTP_STATUS.SUCCESS : HTTP_STATUS.NO_CONTENT_SUCCESS;
      
      res.status(responseStatus).send(response);
  }

    private logError(error: Error){
        const errorLocation = error.stack?.split('\n')[1]?.trim();

        this.errorLogger.log(error.message, {
            location: errorLocation,
            internal_code: error instanceof HttpException ? error.internal_code : INTERNAL_CODE.UNHANDLED_EXCEPTION,
            ...(error instanceof HttpException ? {} : { stack: error.stack }),
        });
    }

    private formatError(error: HttpException): HttpExceptionDTO{
        return {
            status: error.status,
            message: error.message,
            internal_code: error.internal_code
        }
    }

    private formatErrorResponse(error: HttpException): ErrorResponseDTO {
        return {
            result: {},
            status: false,
            error: this.formatError(error)
        }
    }

    private formatResponse<ResultType>(data: ResultType): ResponseDTO<ResultType> {
        return {
            result: data,
            status: true,
            error: {}
        }
    }
}
