import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

export default {
    [INTERNAL_CODE.MISSING_TOKEN]: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Authentication token was not provided.",
        internal_code: INTERNAL_CODE.MISSING_TOKEN
    },
    [INTERNAL_CODE.INVALID_CREDENTIALS]: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid email or password.",
        internal_code: INTERNAL_CODE.INVALID_CREDENTIALS
    },
}
