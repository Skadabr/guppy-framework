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
                .setFromEnvironment("serverPort", "APP_PORT")
            .end();
    }

    services(container: Container, config: ConfigState) {
        container
            .factory(RouteRegistry, () => new RouteRegistry())
            .factory(ErrorHandlerRegistry, () => new ErrorHandlerRegistry())
            .factory(RouteBuilder, () => new RouteBuilder(
                container.get(Container),
                container.get(RouteRegistry),
                container.get(MiddlewareRegistry)
            ))
            .factory(Router, () => new DefaultRouter(
                container.get(RouteBuilder)
            ))
            .factory(MiddlewareRegistry, () => new MiddlewareRegistry())
            .factory(HttpServer, () => new HttpServer(
                container.get(Router),
                container.get(Presenter),
                container.get(ErrorHandlerRegistry)
            ))
            .factory(
                HttpServerCommand,
                () => new HttpServerCommand(
                    container.get(HttpServer),
                    container.get(LoggerFactory).createLogger("http"),
                    config.has("guppy.http.serverPort")
                        ? parseInt(<string> config.get("guppy.http.serverPort"))
                        : null
                )
            )
            .factory(
                HttpRoutesCommand,
                () => new HttpRoutesCommand(
                    container.get(RouteRegistry)
                )
            )
            .extend(
                CommandRegistry,
                (commandRegistry: CommandRegistry) => {
                    commandRegistry.register("http:server", HttpServerCommand);
                    commandRegistry.register("http:routes", HttpRoutesCommand);
                }
            );
    }
}
