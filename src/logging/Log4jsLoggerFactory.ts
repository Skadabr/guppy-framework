/// <reference path="./log4js.d.ts"/>

import { Log4jsLogger } from "./Log4jsLogger";
import { LoggerFactory, LogLevel } from "./LoggerFactory";

import * as log4js from "log4js";

export class Log4jsLoggerFactory extends LoggerFactory {

    public constructor() {
        super();
        log4js.configure({
            appenders: [
                { type: "console" },
                { type: "file", filename: "logs/guppy.log" },
            ]
        });
    }

    public createLogger(logLevel: LogLevel, loggerName?: string): Log4jsLogger {

        const nativeLogger = log4js.getLogger(loggerName);
        const logger = new Log4jsLogger();

        logger.trace = nativeLogger.trace.bind(nativeLogger);
        logger.debug = nativeLogger.debug.bind(nativeLogger);
        logger.info = nativeLogger.info.bind(nativeLogger);
        logger.warn = nativeLogger.warn.bind(nativeLogger);
        logger.error = nativeLogger.error.bind(nativeLogger);
        logger.fatal = nativeLogger.fatal.bind(nativeLogger);

        return logger;
    }
}