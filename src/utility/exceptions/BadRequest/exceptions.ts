import { HTTP_STATUS } from "@enums/server";

import { INTERNAL_CODE } from "@enums/exception";

export default {
  [INTERNAL_CODE.ID_VALIDATION]: {
    status: HTTP_STATUS.BAD_REQUEST,
    message: "ID must be in uuidv4 format.",
    internal_code: INTERNAL_CODE.ID_VALIDATION
  },
  [INTERNAL_CODE.REQUEST_BODY_VALIDATION]: {
    status: HTTP_STATUS.BAD_REQUEST,
    message: "Invalid request body.",
    internal_code: INTERNAL_CODE.REQUEST_BODY_VALIDATION
  },
  [INTERNAL_CODE.INVALID_QUERY]: {
    status: HTTP_STATUS.BAD_REQUEST,
    message: "Invalid query parameters.",
    internal_code: INTERNAL_CODE.INVALID_QUERY
  },
  [INTERNAL_CODE.INVALID_RESET_TOKEN]: {
    status: HTTP_STATUS.BAD_REQUEST,
    message: "Password reset token is invalid or has expired.",
    internal_code: INTERNAL_CODE.INVALID_RESET_TOKEN
  },
  [INTERNAL_CODE.INVALID_CAPTCHA]: {
    status: HTTP_STATUS.BAD_REQUEST,
    message: "Captcha verification failed. Please try again.",
    internal_code: INTERNAL_CODE.INVALID_CAPTCHA
  }
}
