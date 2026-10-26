export enum INTERNAL_CODE {
    //400 - Bad Request
    ID_VALIDATION = "id_validation",
    REQUEST_BODY_VALIDATION = "request_body_validation",
    INVALID_QUERY = "invalid_query",
    INVALID_RESET_TOKEN = "invalid_reset_token",
    //401 - Unauthorized
    MISSING_TOKEN = "missing_token",
    INVALID_CREDENTIALS = "invalid_credentials",
    //403 - Forbidden
    FORBIDDEN = "forbidden",
    //404 - Not Found
    NOT_FOUND = "not_found",
    //409
    TENANT_ALREADY_EXISTS = "tenant_already_exists",
    EMAIL_ALREADY_EXISTS = "email_already_exists",
    //500 - Server Error
    UNHANDLED_EXCEPTION = "internal_error",
    MISSING_ENVIRONMENTS = "missing_environments"
}
