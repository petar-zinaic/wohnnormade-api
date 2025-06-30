import { Router } from "express";

import ContributeRoutes from "./contribute/ContributeRoutes";
import AuthRoutes from "./auth/AuthRoutes";

export default class AppRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  get serverRoutes() {
    this.router.get("/", (req, res) => res.send("Base API URL"));

    this.router.use("/auth", new AuthRoutes().routes);
    this.router.use("/contribute", new ContributeRoutes().routes);

    return this.router;
  }
}
