import { Router } from "express";

import AuthRoutes from "./auth/AuthRoutes";
import UserRoutes from "./UserRoutes";
import TenantRoutes from "./tenant/TenantRoutes";

export default class AppRouter {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  get serverRoutes() {
    this.router.get("/", (req, res) => res.send("Base API URL"));

    this.router.use("/auth", new AuthRoutes().routes);
    this.router.use("/users", new UserRoutes().routes);
    this.router.use("/tenant", new TenantRoutes().routes);

    return this.router;
  }
}
