import { Logger } from "./Logger";

export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warning,
    Error,
    Fatal
}

export abstract class LoggerFactory {

    public abstract createLogger(logLevel?: LogLevel, loggerName?: string): Logger;
}