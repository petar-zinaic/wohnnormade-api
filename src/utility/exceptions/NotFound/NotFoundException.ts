import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class NotFoundException extends HttpException {
    constructor(entity?: string){
        const exception = config[INTERNAL_CODE.NOT_FOUND];
        const message = entity ? `${entity} not found.` : exception.message;

        super({...exception, message});
    }
}
