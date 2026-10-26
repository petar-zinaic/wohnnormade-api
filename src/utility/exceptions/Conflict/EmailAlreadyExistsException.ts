import HttpException from '../HttpException';

import config from "./exceptions";

import { INTERNAL_CODE } from '@enums/exception';

export default class EmailAlreadyExistsException extends HttpException {
  constructor() {
    super({...config[INTERNAL_CODE.EMAIL_ALREADY_EXISTS]})
  }
}
