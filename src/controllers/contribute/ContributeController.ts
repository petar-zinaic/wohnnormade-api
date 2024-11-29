import { Request, Response } from "express";
import BaseController from "../BaseController";
import {ContributeService} from "src/services/contribute";


export default class ContributeController extends BaseController<ContributeService> {
  constructor() {
    super(new ContributeService())
  }

  createTennant = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.createTanant(req.body);

    this._responseHandler.processResponse(res, result);
  }
}
