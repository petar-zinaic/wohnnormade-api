import HttpException from "../HttpException";

import config from "./exceptions";

import { INTERNAL_CODE } from "@enums/exception";

export default class InvalidCaptchaException extends HttpException {
  constructor() {
    super(config[INTERNAL_CODE.INVALID_CAPTCHA]);
  }
}
