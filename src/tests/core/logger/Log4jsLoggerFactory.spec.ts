import * as assert from "assert";

import { Log4jsLoggerFactory } from "../../../core/logger/Log4jsLoggerFactory";
import { Log4jsLogger } from "../../../core/logger/Log4jsLogger";

describe("guppy.core.logger.Log4jsLoggerFactory", () => {

    it("creates a logger with specified log level", () => {

        const loggerFactory = new Log4jsLoggerFactory(
            {
                configure: (options: any) => {},
                getLogger: (loggerName: string) => ({
                    setLevel: (level: string) => {},
                    trace: (message: string, ...args: any[]) => {},
                    debug: (message: string, ...args: any[]) => {},
                    info: (message: string, ...args: any[]) => {},
                    warn: (message: string, ...args: any[]) => {},
                    error: (message: string, ...args: any[]) => {},
                    fatal: (message: string, ...args: any[]) => {}
                })
            },
            "INFO",
            []
        );

        const logger = loggerFactory.createLogger("testLogger", "ERROR");

        // It replaces defined methods via log4js's methods
        assert.ok(logger instanceof Log4jsLogger);
        assert.notEqual(logger.trace, Log4jsLogger.prototype.trace);
        assert.notEqual(logger.debug, Log4jsLogger.prototype.debug);
        assert.notEqual(logger.info, Log4jsLogger.prototype.info);
        assert.notEqual(logger.warn, Log4jsLogger.prototype.warn);
        assert.notEqual(logger.error, Log4jsLogger.prototype.error);
        assert.notEqual(logger.fatal, Log4jsLogger.prototype.fatal);
    });

    it("creates a logger with default log level", () => {

        const loggerFactory = new Log4jsLoggerFactory(
            {
                configure: (options: any) => {},
                getLogger: (loggerName: string) => ({
                    setLevel: (level: string) => {},
                    trace: (message: string, ...args: any[]) => {},
                    debug: (message: string, ...args: any[]) => {},
                    info: (message: string, ...args: any[]) => {},
                    warn: (message: string, ...args: any[]) => {},
                    error: (message: string, ...args: any[]) => {},
                    fatal: (message: string, ...args: any[]) => {}
                })
            },
            "INFO",
            []
        );
        const logger = loggerFactory.createLogger("testLogger");

        // It replaces defined methods via log4js's methods
        assert.ok(logger instanceof Log4jsLogger);
        assert.notEqual(logger.trace, Log4jsLogger.prototype.trace);
        assert.notEqual(logger.debug, Log4jsLogger.prototype.debug);
        assert.notEqual(logger.info, Log4jsLogger.prototype.info);
        assert.notEqual(logger.warn, Log4jsLogger.prototype.warn);
        assert.notEqual(logger.error, Log4jsLogger.prototype.error);
        assert.notEqual(logger.fatal, Log4jsLogger.prototype.fatal);
    });
});
