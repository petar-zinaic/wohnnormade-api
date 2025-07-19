import { Request, Response } from "express";
import BaseController from "./BaseController";
import UserService from "../services/UserService";
import { UpdateUserInput } from "../types/request/AuthTypes";

export default class UserController extends BaseController<UserService> {
  constructor() {
    super(new UserService());
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await this._service.getUserById(id);
      this._responseHandler.processResponse(res, user);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this._service.getAllUsers();
      this._responseHandler.processResponse(res, users);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUserInput = req.body;
      const user = await this._service.updateUser(id, userData);
      this._responseHandler.processResponse(res, user);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this._service.deleteUser(id);
      this._responseHandler.processResponse(res, null);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }
}
