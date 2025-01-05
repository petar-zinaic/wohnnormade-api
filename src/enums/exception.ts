export enum INTERNAL_CODE {
    //400 - Bad Request
    ID_VALIDATION = "id_validation",
    REQUEST_BODY_VALIDATION = "request_body_validation",
    //401 - Unauthorized
    MISSING_TOKEN = "missing_token",
    //409
    TENNANT_ALREADY_EXISTIS = "tennant_already_exsists",
    //500 - Server Error
    UNHADLED_EXCEPTION = "internal_error",
    MISSING_ENVIRONMENTS = "missing_environments"
}
