import assert = require("assert");

import { ConsoleOutput, CommandRegistry } from "../../../console";
import { DefaultConfig, ConfigState, Container } from "../../../core";
import { HttpBundle, HttpServer, RouteRegistry, Router, MiddlewareRegistry } from "../../../http/server";
import { HttpServerCommand } from "../../../http/server/commands/HttpServerCommand";
import { HttpRoutesCommand } from "../../../http/server/commands/HttpRoutesCommand";
import { Logger } from "../../../core/logger";
import { Presenter, RootPresenter } from "../../../presenter";
import {LoggerFactory} from "../../../core/logger/LoggerFactory";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpBundle", () => {

    let httpBundle: HttpBundle;

    before(() => {
        RouteRegistry.prebootClear();
        httpBundle = new HttpBundle();
    });

    it("can be instantiated", () => {
        assert.ok(httpBundle instanceof HttpBundle);
    });

    it("has a name", () => {
        assert.equal(httpBundle.name(), "guppy.http");
    });

    it("does not have any autoload data", () => {
        assert.deepEqual(httpBundle.autoload(), []);
    });

    it("configurates the application", () => {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        process.env.APP_PORT = 4512;
        httpBundle.config(config);

        assert.equal(configState.get("guppy.http.serverPort"), 4512);
    });

    it("registers all required services", async () => {
        const configState = new ConfigState();
        const container = new Container();

        container.instance(CommandRegistry, new CommandRegistry());
        container.instance(Presenter, new RootPresenter());
        container.instance(LoggerFactory, mock<LoggerFactory>({
            createLogger: (loggerName: string) => mock<Logger>()
        }));
        container.instance(ConsoleOutput, mock<ConsoleOutput>());

        httpBundle.services(container, configState);

        assert.ok(await container.get(Router) instanceof Router);
        assert.ok(await container.get(MiddlewareRegistry) instanceof MiddlewareRegistry);
        assert.ok(await container.get(RouteRegistry) instanceof RouteRegistry);
        assert.ok(await container.get(HttpServer) instanceof HttpServer);
        assert.ok(await container.get(HttpServerCommand) instanceof HttpServerCommand);
        assert.ok(await container.get(HttpRoutesCommand) instanceof HttpRoutesCommand);

        return container
            .get(CommandRegistry)
            .then((commandRegistry: CommandRegistry) => {
                const allRegisteredCommands = commandRegistry.all();
                assert.ok(allRegisteredCommands.hasOwnProperty("http:server"));
                assert.equal(allRegisteredCommands["http:server"], HttpServerCommand);
                assert.ok(allRegisteredCommands.hasOwnProperty("http:routes"));
                assert.equal(allRegisteredCommands["http:routes"], HttpRoutesCommand);
            });
    });

    it("loads a port for http server from config", async () => {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);
        const container = new Container();
        const commandRegistry = new CommandRegistry();

        container.instance(CommandRegistry, commandRegistry);
        container.instance(Presenter, new RootPresenter());
        container.instance(LoggerFactory, mock<LoggerFactory>({
            createLogger: (loggerName: string) => mock<Logger>()
        }));
        container.instance(ConsoleOutput, mock<ConsoleOutput>());

        process.env.APP_PORT = 2310;
        httpBundle.config(config);
        httpBundle.services(container, configState);

        const httpServerCommand = await container.get(HttpServerCommand);

        assert.equal(httpServerCommand.serverPort, 2310);
    });
});