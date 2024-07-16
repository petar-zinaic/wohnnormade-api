import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

export default {
    [INTERNAL_CODE.MISSING_ENVIRONMENTS]: {
        status: HTTP_STATUS.INTERNAL,
        internal_code: INTERNAL_CODE.MISSING_ENVIRONMENTS
    }
}
