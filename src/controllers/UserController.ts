import { Request, Response } from "express";
import BaseController from "./BaseController";
import UserService from "@services/UserService";
import { AuthRequest } from "@requestType";
import { UpdateUserInput } from "@requestType/AuthTypes";

export default class UserController extends BaseController<UserService> {
  constructor() {
    super(new UserService());
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const user = await this._service.getUserById(id);
    this._responseHandler.processResponse(res, user);
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await this._service.getAllUsers();
    this._responseHandler.processResponse(res, users);
  };

  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const userData: UpdateUserInput = req.body;
    const user = await this._service.updateUser(id, userData, req.userId!);
    this._responseHandler.processResponse(res, user);
  };

  deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    await this._service.deleteUser(id, req.userId!);
    this._responseHandler.processResponse(res, null);
  };
}
