import { Request, Response } from "express";
import BaseController from "../BaseController";
import { TenantService } from "@services/tenant";
import { AuthRequest, UpdateTenantInput } from "@requestType";

export default class TenantController extends BaseController<TenantService> {
  constructor() {
    super(new TenantService());
  }

  createTenant = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this._service.createTenant(req.body, req.userId!);

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
    // Query is validated by validateTenantSearchQuery
    const { q, dateOfBirth } = req.query as { q: string; dateOfBirth?: string };

    const result = await this._service.searchTenantsByName(q, dateOfBirth);

    this._responseHandler.processResponse(res, result);
  };

  updateTenant = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateTenantInput = req.body;
    const result = await this._service.updateTenant(
      parseInt(id),
      updateData,
      req.userId!
    );

    this._responseHandler.processResponse(res, result);
  };

  deleteTenant = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await this._service.deleteTenant(parseInt(id), req.userId!);

    this._responseHandler.processResponse(res, result);
  };
}
