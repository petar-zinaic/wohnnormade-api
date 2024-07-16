import winston, { 
    format,
    transports, 
    Logger as WinstonLogger, 
} from "winston";

import config from "./config";
import envConfig from "@config/environment";

import { DateTime } from "@enums/dateTime";
import { Environment } from "@enums/environment";

import { LogMeta, LogLevel } from "./types";

export default class BaseLogger {
    private logger: WinstonLogger;
    private logLevel: LogLevel;
    private loggerFilePath = {
        [LogLevel.INFO]: config.info_file_path,
        [LogLevel.ERROR]: config.error_file_path,
    }

    constructor(level: LogLevel) {
        this.logLevel = level;
        this.logger = winston.createLogger({
            level,
            format: format.combine(
                format.timestamp({format: DateTime.FULL_DATE_TIME}),
                format.json(),
                format.prettyPrint()
            )
        });

        if (envConfig.server.environment === Environment.PRODUCTION) {
            this.logger.add(new transports.File({ filename: this.getLogFilePath}));
        }

        this.logger.add(new transports.Console({
            format: format.simple()
        }));
    }

    private get getLogFilePath(){
        return this.loggerFilePath[this.logLevel];
    }

    public log(message: string, meta?: LogMeta) {
        this.logger.log(this.logLevel, message, meta);
    }
}
