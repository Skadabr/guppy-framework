declare module "log4js" {

    export namespace log4js {

        interface Logger {
            trace(message: string, ...args: any[]): void;
            debug(message: string, ...args: any[]): void;
            info(message: string, ...args: any[]): void;
            warn(message: string, ...args: any[]): void;
            error(message: string, ...args: any[]): void;
            fatal(message: string, ...args: any[]): void;
        }

        export interface Config {
            appenders: AppenderConfig[];
            levels?: { [category: string]: string };
            replaceConsole?: boolean;
        }

        export interface AppenderConfigBase {
            type: string;
            category?: string;
        }

        export interface ConsoleAppenderConfig extends AppenderConfigBase {}

        export interface FileAppenderConfig extends AppenderConfigBase {
            filename: string;
        }

        type AppenderConfig = ConsoleAppenderConfig | FileAppenderConfig;
    }

    export function configure(config: log4js.Config, options?: any): void;
    export function getLogger(categoryName?: string): log4js.Logger;
}