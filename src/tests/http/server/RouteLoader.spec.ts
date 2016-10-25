import assert = require("assert");

import { MetadataRegistry, Container } from "../../../core";
import { Get, Path } from "../../../http";
import { RouteLoader, HandlerResolver } from "../../../http/server";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.RouteLoader", () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("register handlers for found routes", () => {

        @Path("/users")
        class UserController {
            @Get()
            list() { }
        }

        const routes = [];

        const container = new Container(); 

        container.instance(UserController, new UserController());

        const routeLoader = new RouteLoader(container, mock<HandlerResolver>({
            registerHandler(method: string, path: string, controller: Function, methodName: string, handlerArguments) {
                routes.push({
                    method: method,
                    path: path,
                    controller: controller,
                    methodName: methodName,
                    handlerArguments: handlerArguments
                })
            }
        }));

        return routeLoader
            .load()
            .then(() => {
                assert.equal(routes.length, 1);
                assert.ok(routes[0]["controller"] instanceof UserController);
                assert.deepEqual(routes[0]["handlerArguments"], []);
                assert.equal(routes[0]["method"], "GET");
                assert.equal(routes[0]["methodName"], "list");
                assert.equal(routes[0]["path"], "/users");
            });
    });

});