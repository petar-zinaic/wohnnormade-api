import { Request, Response } from "express";
import BaseController from "../BaseController";
import AuthService from "@services/auth/AuthService";

interface AuthRequest extends Request {
  userId?: number;
}

export default class AuthController extends BaseController<AuthService> {
  constructor() {
    super(new AuthService());
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.register(req.body);
    this._responseHandler.processResponse(res, result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.login(req.body);
    this._responseHandler.processResponse(res, result);
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new Error("User not authenticated");
    }
    const result = await this._service.changePassword(req.userId, req.body);
    this._responseHandler.processResponse(res, result);
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.forgotPassword(req.body);
    this._responseHandler.processResponse(res, result);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this._service.resetPassword(req.body);
    this._responseHandler.processResponse(res, result);
  };
}
