import { Request, Response } from "express";
import BaseController from "../BaseController";
import { TenantService } from "src/services/tenant";

interface AuthRequest extends Request {
  userId?: number;
}

export default class TenantController extends BaseController<TenantService> {
  constructor() {
    super(new TenantService());
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

  searchTenantsByName = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return this._responseHandler.processResponse(res, {
        success: false,
        message: "Name parameter is required",
        data: null,
      });
    }

    const result = await this._service.searchTenantsByName(name);

    this._responseHandler.processResponse(res, result);
  };
}
