// This file is part of: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/log4js/log4js.d.ts

declare module "log4js" {

    export interface Logger {
        setLevel(level: string): void;
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

    export type AppenderConfig = ConsoleAppenderConfig | FileAppenderConfig;

    export function configure(config: Config, options?: any): void;
    export function getLogger(categoryName?: string): Logger;
}