import { DefaultConfig, ConfigState, Container } from "../../../core";
import {
    HttpBundle,
    HandlerResolver, 
    RouteLoader,
    ActionInvoker,
    ReducerRegistry,
    HttpServer
} from "../../../http/server";
import { HttpServerCommand } from "../../../http/server/commands/HttpServerCommand";
import { HttpRoutesCommand } from "../../../http/server/commands/HttpRoutesCommand";
import { Presenter, RootPresenter } from "../../../presenter";

import assert = require("assert");

describe("guppy.http.server.HttpBundle", () => {

    let httpBundle: HttpBundle;

    before(() => {
        httpBundle = new HttpBundle();
    });

    it("can be instantiated", () => {
        assert.ok(httpBundle instanceof HttpBundle);
    });

    it("has a name", () => {
        assert.equal(httpBundle.name(), "guppy.http");
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

        container.instance(Presenter, new RootPresenter())

        httpBundle.services(container, configState);

        assert.ok(await container.get(HandlerResolver) instanceof HandlerResolver);
        assert.ok(await container.get(RouteLoader) instanceof RouteLoader);
        assert.ok(await container.get(ActionInvoker) instanceof ActionInvoker);
        assert.ok(await container.get(ReducerRegistry) instanceof ReducerRegistry);
        assert.ok(await container.get(HandlerResolver) instanceof HandlerResolver);
        assert.ok(await container.get(HttpServer) instanceof HttpServer);
        assert.ok(await container.get(HttpServerCommand) instanceof HttpServerCommand);
        assert.ok(await container.get(HttpRoutesCommand) instanceof HttpRoutesCommand);
    });

    it("loads a port for http server from config", async () => {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);
        const container = new Container();

        container.instance(Presenter, new RootPresenter())

        process.env.APP_PORT = 2310;
        httpBundle.config(config);
        httpBundle.services(container, configState);

        const httpServerCommand = await container.get(HttpServerCommand);

        assert.equal(httpServerCommand.serverPort, 2310);
    });
});