import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import { InfoLogger } from "@utility/logger";

const infoLogger = new InfoLogger();

const getMethodColor = (method: string) => {
  switch (method.toLowerCase()) {
    case "get":
      return chalk.green;
    case "post":
      return chalk.blue;
    case "put":
      return chalk.yellow;
    case "patch":
      return chalk.magenta;
    case "delete":
      return chalk.red;
    default:
      return chalk.white;
  }
};

const getStatusColor = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return chalk.green;
  if (statusCode >= 300 && statusCode < 400) return chalk.cyan;
  if (statusCode >= 400 && statusCode < 500) return chalk.yellow;
  if (statusCode >= 500) return chalk.red;
  return chalk.white;
};

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const ip = req.ip || req.connection.remoteAddress || "unknown";

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const methodColor = getMethodColor(req.method);
    const statusColor = getStatusColor(res.statusCode);
    const durationColor =
      duration > 1000
        ? chalk.red
        : duration > 500
        ? chalk.yellow
        : chalk.magenta;

    const logLine = `${methodColor(req.method.padEnd(6))} ${chalk.cyan(
      req.originalUrl
    )} ${statusColor(res.statusCode)} ${durationColor(
      `${duration}ms`
    )} ${chalk.gray(`[${ip}]`)}`;

    console.log(logLine);

    infoLogger.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: ip,
        timestamp: new Date().toISOString(),
      }
    );
  });

  next();
};

export default requestLogger;
