/// <reference path="./logger/log4js.d.ts"/>

import { Bundle } from "./Bundle";
import { Config, ConfigState } from "./Config";
import { Container } from "./Container";
import { LoggerFactory, Logger, Log4jsLoggerFactory, LogLevel } from "./logger";

/** @internal */
import * as log4js from "log4js";

export class CoreBundle implements Bundle {

    public name(): string {
        return "guppy.core";
    }

    public autoload(): string[] {
        return [];
    }

    public config(config: Config): void {

        config
            .section("guppy.core.logger")
                .set("level", "DEBUG")
                .set("factoryClass", Log4jsLoggerFactory)
                .set("appenders", [
                    { type: "console" },
                    { type: "file", filename: "logs/guppy.log" },
                ])
            .end();
    }

    public services(container: Container, config: ConfigState): void {
        container
            .factory(Log4jsLoggerFactory, () => new Log4jsLoggerFactory(
                log4js,
                <LogLevel> config.get("guppy.core.logger.level"),
                <any> config.get("guppy.core.logger.appenders")
            ))
            .factory(LoggerFactory, () => container.get(
                <any> config.get("guppy.core.logger.factoryClass")
            ))
            .factory(Logger, () => {
                return container.get(LoggerFactory).createLogger("default");
            });
    }
}
