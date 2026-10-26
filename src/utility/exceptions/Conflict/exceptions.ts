import { HTTP_STATUS } from "@enums/server";

import { INTERNAL_CODE } from "@enums/exception";

export default {
  [INTERNAL_CODE.TENANT_ALREADY_EXISTS]: {
    status: HTTP_STATUS.CONFLICT,
    message: "Tenant already exists.",
    internal_code: INTERNAL_CODE.TENANT_ALREADY_EXISTS
  },
  [INTERNAL_CODE.EMAIL_ALREADY_EXISTS]: {
    status: HTTP_STATUS.CONFLICT,
    message: "User with this email already exists.",
    internal_code: INTERNAL_CODE.EMAIL_ALREADY_EXISTS
  }
}
