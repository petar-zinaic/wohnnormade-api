import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class ForbiddenException extends HttpException {
    constructor(message?: string){
        const exception = config[INTERNAL_CODE.FORBIDDEN];

        super({...exception, message: message || exception.message});
    }
}
