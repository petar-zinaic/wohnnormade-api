import BaseRoutes from "../BaseRoutes";

import { UserController } from "@controllers";

import { asyncHandler } from "@middlewares";

//todo - This is just a presentation, but it may be used in future
export default class UserRoutes extends BaseRoutes<UserController> {
    constructor(){
        super(new UserController());
    }

    get routes(){
        this._router.get("/", asyncHandler(this._controller.findAllPaginated)); 

        return this._router;
    }
}
