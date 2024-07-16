import { Request, Response } from "express";

import { UserService } from "@services";

import BaseController from "./BaseController";

import { formatPaginationOptionFromQuery } from "@utility/helpers/paginationHelper";

import { PaginatedResponse, UserListResponse } from "@responseType";

export default class UserController extends BaseController<UserService> {
    constructor(){
        super(new UserService());
    }

    findAllPaginated = async (req: Request, res: Response): Promise<void> => {
        const paginationOption = formatPaginationOptionFromQuery(req.query);
        const result = await this._service.findAllPaginated(paginationOption);
        
        this._responseHandler.processResponse<PaginatedResponse<UserListResponse>>(result, res);
    }
}
