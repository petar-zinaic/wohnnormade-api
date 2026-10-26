import BaseRoutes from "./BaseRoutes";
import CommunicationController from "@controllers/CommunicationController";
import { asyncHandler, authenticateToken } from "@middlewares";
import {
  validateContactReporterInput,
  validateReplyToThreadInput,
} from "@middlewares/validations/validateCommunicationInput";

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
      asyncHandler(this._controller.contactReporter)
    );

    // Reply to thread endpoint
    this._router.post(
      "/reply",
      validateReplyToThreadInput,
      asyncHandler(this._controller.replyToThread)
    );

    // Get specific thread
    this._router.get(
      "/thread/:threadId",
      asyncHandler(this._controller.getThread)
    );

    // Get user's conversations
    this._router.get(
      "/my-conversations",
      asyncHandler(this._controller.getUserConversations)
    );

    return this._router;
  }
}
