import { Bundle } from "../../core/Bundle";
import { Container } from "../../core/Container";
import { Config, ConfigState } from "../../core/Config";
import { HttpServer } from "./HttpServer";
import { HttpServerCommand } from "./commands/HttpServerCommand";
import { HttpRoutesCommand } from "./commands/HttpRoutesCommand";
import { Presenter } from "../../presenter/Presenter";
import { CommandRegistry } from "../../console/CommandRegistry";
import { RouteRegistry } from "./RouteRegistry";
import { Router, DefaultRouter } from ".";
import { MiddlewareRegistry } from "./MiddlewareRegistry";
import { RouteBuilder } from "./RouteBuilder";
import { ErrorHandlerRegistry } from "./ErrorHandlerRegistry";
import { LoggerFactory } from "../../core/logger";

export class HttpBundle implements Bundle {

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
            .factory(RouteRegistry, () => new RouteRegistry(false))
            .service(RouteBuilder, [
                Container,
                RouteRegistry,
                MiddlewareRegistry
            ])
            .service(Router, [
                RouteBuilder
            ])
            .service(HttpServer, [
                Router,
                Presenter,
                ErrorHandlerRegistry
            ])
            .factory(HttpServerCommand, () => new HttpServerCommand(
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
                commandRegistry.register("http:serve", HttpServerCommand);
                commandRegistry.register("http:routes", HttpRoutesCommand);
            });
    }
}
