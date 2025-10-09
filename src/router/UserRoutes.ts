import { Router } from "express";
import BaseRoutes from "./BaseRoutes";
import UserController from "../controllers/UserController";
import {
  validateUpdateUserInput,
  validateUserId,
} from "../middlewares/validations/validateUserInput";

export default class UserRoutes extends BaseRoutes<UserController> {
  constructor() {
    super(new UserController());
  }

  get routes() {
    // Get all users
    this._router.get("/", this._controller.getAllUsers.bind(this._controller));

    // Get user by ID
    this._router.get(
      "/:id",
      validateUserId,
      this._controller.getUserById.bind(this._controller)
    );

    // Update user
    this._router.put(
      "/:id",
      validateUserId,
      validateUpdateUserInput,
      this._controller.updateUser.bind(this._controller)
    );

    // Delete user
    this._router.delete(
      "/:id",
      validateUserId,
      this._controller.deleteUser.bind(this._controller)
    );

    return this._router;
  }
}
