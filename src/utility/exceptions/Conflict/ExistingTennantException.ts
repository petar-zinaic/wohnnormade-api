import HttpException from '../HttpException';

import config from "./exceptions";

import { INTERNAL_CODE } from '@enums/exception';

export default class ExistingTennantException extends HttpException {
  constructor() {
    super({...config[INTERNAL_CODE.TENNANT_ALREADY_EXISTIS]})
  }
}
