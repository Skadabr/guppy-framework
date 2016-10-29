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
import {MiddlewareRegistry} from "./MiddlewareRegistry";
import {RouteBuilder} from "./RouteBuilder";

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
            .factory(RouteRegistry, async () => new RouteRegistry())
            .factory(RouteBuilder, async () => new RouteBuilder(
                await container.get(Container),
                await container.get(RouteRegistry),
                await container.get(MiddlewareRegistry)
            ))
            .factory(Router, async () => new DefaultRouter(
                await container.get(RouteBuilder)
            ))
            .factory(MiddlewareRegistry, () => new MiddlewareRegistry())
            .factory(HttpServer, async () => new HttpServer(
                await container.get(Router),
                await container.get(Presenter)
            ))
            .factory(
                HttpServerCommand,
                async () => new HttpServerCommand(
                    await container.get(HttpServer),
                    config.has("guppy.http.serverPort")
                        ? parseInt(<string> config.get("guppy.http.serverPort"))
                        : null
                )
            )
            .factory(
                HttpRoutesCommand,
                async () => new HttpRoutesCommand(
                    await container.get(RouteRegistry)
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
