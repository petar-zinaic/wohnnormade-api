import { Prisma, PrismaClient } from "@prisma/client";

import envConfig from "@config/environment";

import { Environment } from "@enums/environment";

class PrismaSingleton {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    const shouldLogToConsole = envConfig.server.environment === Environment.DEVELOPMENT;

    let log: Prisma.LogLevel[] = [];

    if(shouldLogToConsole)
        log = ["query", "error", "info", "warn"];
  
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({log});
    }

    return PrismaSingleton.instance;
  }
}

const prismaInstance = PrismaSingleton.getInstance();

export default prismaInstance;
