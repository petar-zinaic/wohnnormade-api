import { Request, Response } from "express";
import BaseController from "../BaseController";
import { ContributeService } from "src/services/contribute";

export default class ContributeController extends BaseController<ContributeService> {
  constructor() {
    super(new ContributeService());
  }

  createTennant = async (req: Request, res: Response): Promise<void> => {
    // For now, using a default user ID of 1. In a real app, this would come from authentication
    const createdById = 1; // TODO: Get this from authenticated user
    const result = await this._service.createTanant(req.body, createdById);

    this._responseHandler.processResponse(res, result);
  };
}
