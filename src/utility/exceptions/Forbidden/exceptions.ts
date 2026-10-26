import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

export default {
    [INTERNAL_CODE.FORBIDDEN]: {
        status: HTTP_STATUS.FORBIDDEN,
        message: "You do not have permission to perform this action.",
        internal_code: INTERNAL_CODE.FORBIDDEN
    },
}
