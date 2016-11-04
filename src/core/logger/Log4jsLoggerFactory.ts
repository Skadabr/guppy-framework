import { Log4jsLogger } from "./Log4jsLogger";
import { LoggerFactory, LogLevel } from "./LoggerFactory";

export class Log4jsLoggerFactory extends LoggerFactory {

    public constructor(
        private log4js: any,
        private defaultLogLevel: LogLevel,
        appenders: Object[]
    ) {
        super();
        log4js.configure({ appenders: appenders });
    }

    public createLogger(loggerName: string, logLevel?: LogLevel): Log4jsLogger {

        const nativeLogger = this.log4js.getLogger(`[${loggerName}]`);
        const logger = new Log4jsLogger();
        
        nativeLogger.setLevel(logLevel || this.defaultLogLevel);

        logger.trace = nativeLogger.trace.bind(nativeLogger);
        logger.debug = nativeLogger.debug.bind(nativeLogger);
        logger.info = nativeLogger.info.bind(nativeLogger);
        logger.warn = nativeLogger.warn.bind(nativeLogger);
        logger.error = nativeLogger.error.bind(nativeLogger);
        logger.fatal = nativeLogger.fatal.bind(nativeLogger);

        return logger;
    }
}