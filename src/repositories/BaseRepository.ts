import prismaInstance from "@utility/database/PrismaSingleton";

import { PrismaClient } from "@prisma/client";
import { PaginationOption } from "@requestType";
import { PaginatedResponse } from "@responseType";

export default abstract class BaseRepository {
    protected prismaClient: PrismaClient;

    constructor(){
        this.prismaClient = prismaInstance;
    }

    protected formatPaginatedResponse<DataType>(data: DataType[], total_records: number, options: PaginationOption): PaginatedResponse<DataType> {
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
}
