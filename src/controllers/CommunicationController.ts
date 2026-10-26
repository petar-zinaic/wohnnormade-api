import { Response } from "express";
import BaseController from "./BaseController";
import CommunicationService from "@services/CommunicationService";
import { AuthRequest } from "@requestType";
import {
  ContactReporterInput,
  ReplyToThreadInput,
} from "@requestType/CommunicationTypes";

// All routes run behind authenticateToken, so req.userId is always set
export default class CommunicationController extends BaseController<CommunicationService> {
  constructor() {
    super(new CommunicationService());
  }

  contactReporter = async (req: AuthRequest, res: Response): Promise<void> => {
    const data: ContactReporterInput = req.body;
    const result = await this._service.contactReporter(data, req.userId!);
    this._responseHandler.processResponse(res, result);
  };

  replyToThread = async (req: AuthRequest, res: Response): Promise<void> => {
    const data: ReplyToThreadInput = req.body;
    const result = await this._service.replyToThread(data, req.userId!);
    this._responseHandler.processResponse(res, result);
  };

  getThread = async (req: AuthRequest, res: Response): Promise<void> => {
    const threadId = req.params.threadId;
    const result = await this._service.getThread(threadId, req.userId!);
    this._responseHandler.processResponse(res, result);
  };

  getUserConversations = async (req: AuthRequest, res: Response): Promise<void> => {
    const result = await this._service.getUserConversations(req.userId!);
    this._responseHandler.processResponse(res, result);
  };
}
