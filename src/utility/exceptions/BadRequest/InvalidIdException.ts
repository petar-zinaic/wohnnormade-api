import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class InvalidIdException extends HttpException {
    constructor(){
        super(config[INTERNAL_CODE.ID_VALIDATION]);
    }
}
