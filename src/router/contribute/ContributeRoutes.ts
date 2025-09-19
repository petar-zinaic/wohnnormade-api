import {
  asyncHandler,
  validateTennantInput,
  authenticateToken,
} from "@middlewares";
import BaseRoutes from "../BaseRoutes";

import { ContributeController } from "src/controllers/contribute";

export default class ContributeRoutes extends BaseRoutes<ContributeController> {
  constructor() {
    super(new ContributeController());
  }

  get routes() {
    this._router.post(
      "/create-tennant",
      authenticateToken,
      validateTennantInput,
      asyncHandler(this._controller.createTennant)
    );
    this._router.get("/tenants", asyncHandler(this._controller.getAllTenants));
    this._router.get(
      "/tenants/:id",
      asyncHandler(this._controller.getTenantById)
    );

    return this._router;
  }
}
