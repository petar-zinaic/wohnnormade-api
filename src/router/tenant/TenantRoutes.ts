import {
  asyncHandler,
  validateTenantInput,
  validateUpdateTenantInput,
  validateTenantSearchQuery,
  validateNumericIdParam,
  authenticateToken,
} from "@middlewares";
import BaseRoutes from "../BaseRoutes";

import { TenantController } from "@controllers/tenant";

export default class TenantRoutes extends BaseRoutes<TenantController> {
  constructor() {
    super(new TenantController());
  }

  get routes() {
    this._router.post(
      "/create",
      authenticateToken,
      validateTenantInput,
      asyncHandler(this._controller.createTenant)
    );
    this._router.get("/", asyncHandler(this._controller.getAllTenants));
    this._router.get(
      "/search",
      validateTenantSearchQuery,
      asyncHandler(this._controller.searchTenantsByName)
    );
    this._router.get(
      "/:id",
      validateNumericIdParam,
      asyncHandler(this._controller.getTenantById)
    );
    this._router.put(
      "/:id",
      authenticateToken,
      validateNumericIdParam,
      validateUpdateTenantInput,
      asyncHandler(this._controller.updateTenant)
    );
    this._router.delete(
      "/:id",
      authenticateToken,
      validateNumericIdParam,
      asyncHandler(this._controller.deleteTenant)
    );

    return this._router;
  }
}
