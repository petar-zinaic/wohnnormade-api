import { Router } from "express";
import BaseRoutes from "./BaseRoutes";
import CommunicationController from "../controllers/CommunicationController";
import { authenticateToken } from "@middlewares";
import {
  validateContactReporterInput,
  validateReplyToThreadInput,
} from "../middlewares/validations/validateCommunicationInput";

export default class CommunicationRoutes extends BaseRoutes<CommunicationController> {
  constructor() {
    super(new CommunicationController());
  }

  get routes() {
    // All communication routes require authentication
    this._router.use(authenticateToken);

    // Contact reporter endpoint
    this._router.post(
      "/contact-reporter",
      validateContactReporterInput,
      this._controller.contactReporter.bind(this._controller)
    );

    // Reply to thread endpoint
    this._router.post(
      "/reply",
      validateReplyToThreadInput,
      this._controller.replyToThread.bind(this._controller)
    );

    // Get specific thread
    this._router.get(
      "/thread/:threadId",
      this._controller.getThread.bind(this._controller)
    );

    // Get user's conversations
    this._router.get(
      "/my-conversations",
      this._controller.getUserConversations.bind(this._controller)
    );

    return this._router;
  }
}
