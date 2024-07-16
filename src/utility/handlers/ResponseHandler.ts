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

    public processError(error: HttpException, res: Response){
        const response = this.formatErrorResponse(error);
        
        this.logError(error);
        res.status(error.status || HTTP_STATUS.INTERNAL).send(response || INTERNAL_CODE.UNHADLED_EXCEPTION);
    }

    public processResponse<ResultType>(data: ResultType, res: Response){
        const response = this.formatResponse(data);
        
        res.status(HTTP_STATUS.SUCCESS).send(response);
    }

    private logError(error: HttpException){
        const errorLocation = error.stack?.split('\n')[1].trim();

        this.errorLogger.log(error.message, {
            location: errorLocation,
            internal_code: error.internal_code, 
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
