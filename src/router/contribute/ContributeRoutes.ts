import {asyncHandler, validateTennantInput} from "@middlewares";
import BaseRoutes from "../BaseRoutes";

import { ContributeController } from "src/controllers/contribute";

export default class ContributeRoutes extends BaseRoutes<ContributeController> {
  constructor() {
		super(new ContributeController())
	}

  get routes() {
    this._router.post("/create-tennant", validateTennantInput, asyncHandler(this._controller.createTennant));

    return this._router;
  }
}
