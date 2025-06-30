import { asyncHandler } from "@middlewares";
import {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
  validateResetPasswordInput,
  validateForgotPasswordInput,
} from "../../middlewares/validations/validateAuthInput";
import { authenticateToken } from "../../middlewares/auth/authMiddleware";
import BaseRoutes from "../BaseRoutes";
import { AuthController } from "../../controllers/auth";

export default class AuthRoutes extends BaseRoutes<AuthController> {
  constructor() {
    super(new AuthController());
  }

  get routes() {
    // Public routes (no authentication required)
    this._router.post(
      "/register",
      validateRegisterInput,
      asyncHandler(this._controller.register)
    );
    this._router.post(
      "/login",
      validateLoginInput,
      asyncHandler(this._controller.login)
    );
    this._router.post(
      "/forgot-password",
      validateForgotPasswordInput,
      asyncHandler(this._controller.forgotPassword)
    );
    this._router.post(
      "/reset-password",
      validateResetPasswordInput,
      asyncHandler(this._controller.resetPassword)
    );

    // Protected routes (authentication required)
    this._router.put(
      "/change-password",
      authenticateToken,
      validateChangePasswordInput,
      asyncHandler(this._controller.changePassword)
    );

    return this._router;
  }
}
