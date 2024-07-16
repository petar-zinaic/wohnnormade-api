import BaseLogger from "./BaseLogger";

import { LogLevel } from "./types";

export default class InfoLogger extends BaseLogger {
    constructor(){
        super(LogLevel.INFO);
    }
}
