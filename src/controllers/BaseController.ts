import { ResponseHandler } from "@utility/handlers";

export default class BaseController<Service> {
    protected _service: Service;
    protected _responseHandler: ResponseHandler;

    constructor(service: Service){
        this._service = service;
        this._responseHandler = new ResponseHandler();
    }
}
