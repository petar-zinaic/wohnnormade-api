import { HTTP_STATUS } from "@enums/server";
import { INTERNAL_CODE } from "@enums/exception";

export interface ResponseDTO<ResultType> {
    result: ResultType;
    status: true;
    error: {};
}

export interface ErrorResponseDTO {
    result: {};
    status: false;
    error: HttpExceptionDTO;
}

export interface HttpExceptionDTO {
    status: HTTP_STATUS;
    message: string;
    internal_code: INTERNAL_CODE;
}

export interface PaginatedResponse<DataType>{
    data: DataType[];
    pagination: PaginationDTO;
}

export interface PaginationDTO {
    total_records: number;
    total_pages: number;
    current_page: number;
    limit: number;
}
