import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class InvalidQueryException extends HttpException {
  constructor(validationMessage: string) {
    super({...config[INTERNAL_CODE.INVALID_QUERY], message: validationMessage});
  }
}
