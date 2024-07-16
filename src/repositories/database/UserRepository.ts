import BaseRepository from "./BaseRepository";

import { User } from "@prisma/client";
import { PaginationOption } from "@requestType";
import { PaginatedResponse } from "@responseType";

export default class UserRepository extends BaseRepository {
    public async getTotalCount(): Promise<number> {
        return await this.prismaClient.user.count();
    }

    public async findAllPaginated(pagination: PaginationOption): Promise<PaginatedResponse<User>> { 
        const users = await this.prismaClient.user.findMany({
            ...pagination,
            orderBy: {
                created_at: 'desc'
            }
        });
        const totalRecords = await this.prismaClient.user.count();

        return this.formatPaginatedResponse(users, totalRecords, pagination);
    }
}
