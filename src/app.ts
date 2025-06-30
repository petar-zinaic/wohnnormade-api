import cors from "cors";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";

import AppRouter from "./router/AppRouter";

import prismaInstance from "@database";
import { errorMiddleware } from "@middlewares";

import { generateSwaggerYaml } from "@utility/helpers/swaggerHelper";

import envConfig from "@config/environment";

import { Express } from "express";

class Nexit {
  private app: Express;
  private router: AppRouter;

  constructor() {
    this.app = express();
    this.app.use(cors());

    this.router = new AppRouter();

    this.initializeMiddlewares();
    this.initializeServerRoutes();
    this.initializeResponseMiddlewares();

    this.connectToDatabase();
  }

  public listen() {
    this.app.listen(envConfig.server.port, () => {
      console.log(`App listening on the port ${envConfig.server.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  private initializeServerRoutes() {
    this.app.use("/api", this.router.serverRoutes);

    const swaggerUrl = "/swagger.yaml";
    const swaggerYAML = generateSwaggerYaml(
      path.join(__dirname, "public", "documentation")
    );

    this.app.get(swaggerUrl, (req, res) => {
      res.type("yaml").send(swaggerYAML);
    });

    this.app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(undefined, {
        swaggerOptions: {
          url: swaggerUrl,
        },
      })
    );
  }

  private initializeResponseMiddlewares() {
    this.app.use(errorMiddleware);
  }

  private async connectToDatabase() {
    try {
      await prismaInstance.$connect();
      console.log("Database connection is succesful!");
    } catch (error) {
      console.error("Error connectiong to the database: ", error);
    }
  }
}

export default Nexit;
