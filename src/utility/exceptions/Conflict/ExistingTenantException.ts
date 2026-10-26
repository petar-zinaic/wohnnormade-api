import HttpException from '../HttpException';

import config from "./exceptions";

import { INTERNAL_CODE } from '@enums/exception';

export default class ExistingTenantException extends HttpException {
  constructor() {
    super({...config[INTERNAL_CODE.TENANT_ALREADY_EXISTS]})
  }
}
