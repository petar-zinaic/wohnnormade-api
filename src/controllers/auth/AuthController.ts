import { Request, Response } from "express";
import BaseController from "../BaseController";
import AuthService from "@services/auth/AuthService";
import { AuthRequest } from "@requestType";

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
    const result = await this._service.changePassword(req.userId!, req.body);
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
