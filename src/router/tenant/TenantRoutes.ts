import {
  asyncHandler,
  validateTennantInput,
  validateUpdateTennantInput,
  authenticateToken,
} from "@middlewares";
import BaseRoutes from "../BaseRoutes";

import { TenantController } from "../../controllers/tenant";

export default class TenantRoutes extends BaseRoutes<TenantController> {
  constructor() {
    super(new TenantController());
  }

  get routes() {
    this._router.post(
      "/create",
      authenticateToken,
      validateTennantInput,
      asyncHandler(this._controller.createTennant)
    );
    this._router.get("/", asyncHandler(this._controller.getAllTenants));
    this._router.get(
      "/search",
      asyncHandler(this._controller.searchTenantsByName)
    );
    this._router.get("/:id", asyncHandler(this._controller.getTenantById));
    this._router.put(
      "/:id",
      authenticateToken,
      validateUpdateTennantInput,
      asyncHandler(this._controller.updateTenant)
    );
    this._router.delete(
      "/:id",
      authenticateToken,
      asyncHandler(this._controller.deleteTenant)
    );

    return this._router;
  }
}
