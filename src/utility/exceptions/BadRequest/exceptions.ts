import { HTTP_STATUS } from "@enums/server";

import { INTERNAL_CODE } from "@enums/exception";

export default {
    [INTERNAL_CODE.ID_VALIDATION]: {
        status: HTTP_STATUS.BAD_REQUEST,
        message: "ID must be in uuidv4 forrmat.",
        internal_code: INTERNAL_CODE.ID_VALIDATION
    }
}
