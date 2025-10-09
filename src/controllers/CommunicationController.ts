import { Request, Response } from "express";
import BaseController from "./BaseController";
import CommunicationService from "../services/CommunicationService";
import {
  ContactReporterInput,
  ReplyToThreadInput,
} from "../types/request/CommunicationTypes";

interface AuthRequest extends Request {
  userId?: number;
}

export default class CommunicationController extends BaseController<CommunicationService> {
  constructor() {
    super(new CommunicationService());
  }

  async contactReporter(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new Error("User not authenticated");
      }

      const data: ContactReporterInput = req.body;
      const result = await this._service.contactReporter(data, req.userId);
      this._responseHandler.processResponse(res, result);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async replyToThread(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new Error("User not authenticated");
      }

      const data: ReplyToThreadInput = req.body;
      const result = await this._service.replyToThread(data, req.userId);
      this._responseHandler.processResponse(res, result);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async getThread(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new Error("User not authenticated");
      }

      const threadId = req.params.threadId;
      const result = await this._service.getThread(threadId, req.userId);
      this._responseHandler.processResponse(res, result);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }

  async getUserConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        throw new Error("User not authenticated");
      }

      const result = await this._service.getUserConversations(req.userId);
      this._responseHandler.processResponse(res, result);
    } catch (error: any) {
      this._responseHandler.processError(error, res);
    }
  }
}
