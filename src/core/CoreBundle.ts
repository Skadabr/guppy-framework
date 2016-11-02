import { Bundle } from "./Bundle";
import { Config, ConfigState } from "./Config";
import { Container } from "./Container";
import { LoggerFactory, Logger, Log4jsLoggerFactory } from "./logger";
import {LogLevel} from "./logger/LoggerFactory";

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
            .factory(
                Log4jsLoggerFactory,
                () => new Log4jsLoggerFactory(
                    <LogLevel> config.get("guppy.core.logger.level"),
                    config.get("guppy.core.logger.appenders") as any
                )
            )
            .factory(
                LoggerFactory,
                async () => container.get(
                    config.get("guppy.core.logger.factoryClass") as any
                )
            )
            .factory(
                Logger,
                async () => (await container.get(LoggerFactory)).createLogger("[default]")
            );
    }
}
