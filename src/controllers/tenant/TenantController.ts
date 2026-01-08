import { Request, Response } from "express";
import BaseController from "../BaseController";
import { TenantService } from "@services/tenant";
import { UpdateTennantInput } from "@requestType";

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
    const { q, dateOfBirth } = req.query;

    if (!q || typeof q !== "string") {
      return this._responseHandler.processResponse(res, {
        success: false,
        message: "Search query parameter 'q' is required",
        data: null,
      });
    }

    const result = await this._service.searchTenantsByName(
      q,
      dateOfBirth && typeof dateOfBirth === "string" ? dateOfBirth : undefined
    );

    this._responseHandler.processResponse(res, result);
  };

  updateTenant = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateTennantInput = req.body;
    const result = await this._service.updateTenant(parseInt(id), updateData);

    this._responseHandler.processResponse(res, result);
  };

  deleteTenant = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this._service.deleteTenant(parseInt(id));

    this._responseHandler.processResponse(res, result);
  };
}
