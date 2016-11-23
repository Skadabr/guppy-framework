import { Bundle, Config, ConfigState, Container, Logger, LoggerFactory } from "../../core";
import { HttpServer } from "./HttpServer";
import { HttpServeCommand } from "./commands/HttpServeCommand";
import { HttpRoutesCommand } from "./commands/HttpRoutesCommand";
import { Presenter } from "../../presenter/Presenter";
import { CommandRegistry } from "../../console/CommandRegistry";
import { RouteRegistry } from "./RouteRegistry";
import { Router } from ".";
import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { RouteBuilder } from "./RouteBuilder";
import { ErrorHandlerRegistry } from "./ErrorHandlerRegistry";
import { DefaultRouter } from "./DefaultRouter";

export class HttpBundle extends Bundle {

    name(): string {
        return "guppy.http";
    }

    autoload(): string[] {
        return [];
    }

    config(config: Config) {
        config
            .section("guppy.http")
                .setFromEnvironment("serverPort", "PORT")
            .end();
    }

    services(container: Container, config: ConfigState) {
        container
            .service(RouteRegistry, () => new RouteRegistry(false))
            .service(RouteBuilder, [
                Container,
                RouteRegistry,
                MiddlewareRegistry
            ])
            .service(Router, () => new DefaultRouter(
                container.get(RouteBuilder)
            ))
            .service(ErrorHandlerRegistry, [
                Logger
            ])
            .service(HttpServer, [
                Router,
                Presenter,
                ErrorHandlerRegistry,
                Logger
            ])
            .service(HttpServeCommand, () => new HttpServeCommand(
                container.get(HttpServer),
                container.get(LoggerFactory).createLogger("http"),
                config.has("guppy.http.serverPort")
                    ? parseInt(<string> config.get("guppy.http.serverPort"))
                    : null
            ))
            .service(HttpRoutesCommand, [
                RouteRegistry
            ])
            .extend(CommandRegistry, (commandRegistry: CommandRegistry) => {
                commandRegistry.register("http:serve", HttpServeCommand);
                commandRegistry.register("http:routes", HttpRoutesCommand);
            });
    }
}
