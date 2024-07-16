import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class MissingEnvironmentsException extends HttpException {
    constructor(missingEnvironment: string){
        const message = `Environment variable with name ${missingEnvironment} is missing.`

        super({...config[INTERNAL_CODE.MISSING_ENVIRONMENTS], message});
    }
}
