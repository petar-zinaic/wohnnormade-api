import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class InvalidCredentialsException extends HttpException {
    constructor(message?: string){
        const exception = config[INTERNAL_CODE.INVALID_CREDENTIALS];

        super({...exception, message: message || exception.message});
    }
}
