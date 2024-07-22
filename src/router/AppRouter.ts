import { Router } from "express";

import UserRoutes from "./database/UserRoutes";
import ContributeRoutes from "./contribute/ContributeRoutes";

export default class AppRouter {
    private router: Router;

    constructor(){
        this.router = Router();
    }

    get serverRoutes(){
        this.router.get("/", (req, res) => res.send("Base API URL"));

        this.router.use("/users", new UserRoutes().routes);
        this.router.use("/contribute", new ContributeRoutes().routes);

        return this.router;
    }
}
