import { Logger } from "./Logger";

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export abstract class LoggerFactory {

    public abstract createLogger(loggerName: string, logLevel?: LogLevel): Logger;
}