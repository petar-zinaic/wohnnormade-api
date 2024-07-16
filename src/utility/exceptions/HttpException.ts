import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

import { HttpExceptionDTO } from "@responseType";

//todo - we should extand error classes to accept the value, req.body req.params so that logs make more sense
export default class HttpException extends Error {
    public message: string;
    public status: HTTP_STATUS;
    public internal_code: INTERNAL_CODE;

    constructor(exception: HttpExceptionDTO){
        super(exception.message);
        
        this.status = exception.status;
        this.message = exception.message;
        this.internal_code = exception.internal_code 
    }
}
