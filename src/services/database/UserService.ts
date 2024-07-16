import { UserRepository } from "@repository";

import BaseService from "./BaseService";

import { UserAssembler } from "@assemblers";

import {
    UserListResponse,
    PaginatedResponse,
} from "@responseType";
import { PaginationOption } from "@requestType";

export default class UserService extends BaseService<UserRepository> {
    private assembler: UserAssembler;

    constructor(){
        super(new UserRepository());

        this.assembler = new UserAssembler();
    }

    public async findAllPaginated(pagination: PaginationOption): Promise<PaginatedResponse<UserListResponse>> {
        const userRecords = await this._repository.findAllPaginated(pagination);

        return {
            data: userRecords.data.map(userRecord => {
                return this.assembler.assembleUserForLists(userRecord);
            }),
            pagination: userRecords.pagination
        }
    }
}
