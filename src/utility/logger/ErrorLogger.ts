import BaseLogger from "./BaseLogger";

import { LogLevel } from "./types";

export default class ErrorLogger extends BaseLogger {
    constructor(){
        super(LogLevel.ERROR)
    }
}
