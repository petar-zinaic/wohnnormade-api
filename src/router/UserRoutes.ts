import BaseRoutes from "./BaseRoutes";
import UserController from "@controllers/UserController";
import { asyncHandler, authenticateToken } from "@middlewares";
import {
  validateUpdateUserInput,
  validateUserId,
} from "@middlewares/validations/validateUserInput";

export default class UserRoutes extends BaseRoutes<UserController> {
  constructor() {
    super(new UserController());
  }

  get routes() {
    // All user routes require authentication
    this._router.use(authenticateToken);

    // Get all users
    this._router.get("/", asyncHandler(this._controller.getAllUsers));

    // Get user by ID
    this._router.get(
      "/:id",
      validateUserId,
      asyncHandler(this._controller.getUserById)
    );

    // Update user (own account only)
    this._router.put(
      "/:id",
      validateUserId,
      validateUpdateUserInput,
      asyncHandler(this._controller.updateUser)
    );

    // Delete user (own account only)
    this._router.delete(
      "/:id",
      validateUserId,
      asyncHandler(this._controller.deleteUser)
    );

    return this._router;
  }
}
