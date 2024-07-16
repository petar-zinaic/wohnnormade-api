import dotenv from "dotenv";

import { Environment } from "@enums/environment";

import { MissingEnvironmentsException } from "@exceptions";

const environment = process.env.NODE_ENV || Environment.LOCAL;

dotenv.config({path: `./environments/${environment}`});

function getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) 
        return defaultValue;

      throw new MissingEnvironmentsException(key);
    }

    return value;
}

export default {
    server: {
        port: getEnvVariable("PORT", "3000"),
        environment: getEnvVariable("NODE_ENV", Environment.LOCAL)
    }
}
