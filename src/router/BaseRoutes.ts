import { Router }from "express";

export default class BaseRoutes<Controller> {
    protected _router: Router;
    protected _controller: Controller;

    constructor(controller: Controller){
        this._router = Router();
        this._controller = controller;
    }
}
