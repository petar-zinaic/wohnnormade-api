import { Request, Response } from "express";
import BaseController from "../BaseController";
import { ContributeService } from "src/services/contribute";

interface AuthRequest extends Request {
  userId?: number;
}

export default class ContributeController extends BaseController<ContributeService> {
  constructor() {
    super(new ContributeService());
  }

  createTennant = async (req: AuthRequest, res: Response): Promise<void> => {
    // Get user ID from authenticated request
    const createdById = req.userId || 1; // Fallback to 1 if no auth (for development)
    const result = await this._service.createTanant(req.body, createdById);

    this._responseHandler.processResponse(res, result);
  };

  getTenantById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this._service.getTenantById(parseInt(id));

    this._responseHandler.processResponse(res, result);
  };

  getAllTenants = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.getAllTenants();

    this._responseHandler.processResponse(res, result);
  };
}
