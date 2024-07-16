import { PaginationOption } from "@requestType";
import { PaginatedResponse } from "@responseType";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10

export function formatPaginationOptionFromQuery(query: any): PaginationOption {
    const limit = parseInt(query.limit) || DEFAULT_LIMIT;
    const page = parseInt(query.current_page) || DEFAULT_PAGE;

    const skip = (page - 1) * limit;

    return {
        skip,
        take: limit,
    }
}

export function formatPaginatedResponse<DataType>(data: DataType[], total_records: number, options: PaginationOption): PaginatedResponse<DataType> {
    const { skip, take } = options;

    const current_page = Math.floor(skip / take) + 1;
    const total_pages = Math.ceil(total_records / take);
  
    return {
        data,
        pagination: {
            total_records,
            total_pages,
            current_page,
            limit: take,
        }
    };
}
