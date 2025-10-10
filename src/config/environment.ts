import dotenv from "dotenv";

import { Environment } from "@enums/environment";

import { MissingEnvironmentsException } from "@exceptions";

const environment = process.env.NODE_ENV;

// Only load from file in local/development environments
// In production (Railway), environment variables are already set
if (
  environment &&
  environment !== Environment.PRODUCTION &&
  environment !== "production"
) {
  dotenv.config({ path: `./environments/${environment}` });
}

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;

    throw new MissingEnvironmentsException(key);
  }

  return value;
}

export default {
  server: {
    port: getEnvVariable("PORT", "3000"),
    environment: getEnvVariable("NODE_ENV", Environment.LOCAL),
  },
  database: {
    url: getEnvVariable("DATABASE_URL"),
  },
  email: {
    resendApiKey: getEnvVariable("RESEND_API_KEY"),
    fromEmail: getEnvVariable("FROM_EMAIL", "noreply@wohnnormade.com"),
    clientUrl: getEnvVariable("CLIENT_URL", "http://localhost:3000"),
  },
};
