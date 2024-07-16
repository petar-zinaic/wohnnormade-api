import { formatPaginatedResponse } from "@utility/helpers/paginationHelper";

import { PaginationOption } from "@requestType";
import { PaginatedResponse } from "@responseType";

interface IRepository {
    getTotalCount(): Promise<number>;
}

export default class BaseService<Repository extends IRepository> {
    protected _repository: Repository;

    constructor(repository: Repository){
        this._repository = repository;
    }

    protected async addPaginationToResponse<DataType>(data: DataType[], pagination: PaginationOption): Promise<PaginatedResponse<DataType>> {
        const totalRecords = await this._repository.getTotalCount();

        return formatPaginatedResponse<DataType>(data, totalRecords, pagination);
    }
}
