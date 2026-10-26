import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class InvalidRequestException extends HttpException {
  constructor(validationMessage: string) {
    super({...config[INTERNAL_CODE.REQUEST_BODY_VALIDATION], message: validationMessage});
  }
}
