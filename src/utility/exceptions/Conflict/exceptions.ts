import { HTTP_STATUS } from "@enums/server";

import { INTERNAL_CODE } from "@enums/exception";

export default {
  [INTERNAL_CODE.TENNANT_ALREADY_EXISTIS]: {
    status: HTTP_STATUS.CONFLICT,
    message: "Tennant already exists.",
    internal_code: INTERNAL_CODE.TENNANT_ALREADY_EXISTIS
  }
}
