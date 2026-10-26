import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

export default {
    [INTERNAL_CODE.NOT_FOUND]: {
        status: HTTP_STATUS.NOT_FOUND,
        message: "Resource not found.",
        internal_code: INTERNAL_CODE.NOT_FOUND
    },
}
