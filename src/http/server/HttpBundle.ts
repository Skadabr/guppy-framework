import { Bundle } from "../../core/Bundle";
import { Container } from "../../core/Container";
import { Config, ConfigState } from "../../core/Config";
import { DefaultHandlerResolver } from "./DefaultHandlerResolver";
import { HandlerResolver } from "./HandlerResolver";
import { RouteLoader } from "./RouteLoader";
import { ActionInvoker } from "./ActionInvoker";
import { HttpServer } from "./HttpServer";
import { HttpServerCommand } from "./commands/HttpServerCommand";
import { HttpRoutesCommand } from "./commands/HttpRoutesCommand";
import { Presenter } from "../../presenter/Presenter";
import { ReducerRegistry, RequestReducer } from "./ReducerRegistry";
import { ConsoleOutput } from "../../console";
import {CommandRegistry} from "../../console/CommandRegistry";

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
            .instance(HandlerResolver, new DefaultHandlerResolver())
            .factory(RouteLoader, async () => new RouteLoader(
                await container.get(Container),
                await container.get(HandlerResolver)
            ))
            .factory(ActionInvoker, async () => new ActionInvoker(
                await container.get(ConsoleOutput)
            ))
            .factory(ReducerRegistry, () => new ReducerRegistry())
            .factory(HttpServer, async () => new HttpServer(
                await container.get(HandlerResolver),
                await container.get(ActionInvoker),
                await container.get(Presenter),
                await container.get(ReducerRegistry)
            ))
            .factory(
                HttpServerCommand,
                async () => new HttpServerCommand(
                    await container.get(HttpServer),
                    await container.get(RouteLoader),
                    config.has("guppy.http.serverPort")
                        ? parseInt(<string> config.get("guppy.http.serverPort"))
                        : null
                )
            )
            .factory(
                HttpRoutesCommand,
                async () => new HttpRoutesCommand(
                    await container.get(Container)
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
