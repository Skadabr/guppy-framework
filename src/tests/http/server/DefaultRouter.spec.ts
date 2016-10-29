import { NotFoundHandler, RouteRegistry } from "../../../http/server";
import { Response, Request } from "../../../http";
import { DefaultRouter } from "../../../http/server";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.DefaultRouter", () => {

    it("registers a route", () => {

        const handlerResolver = new DefaultRouter(
            mock<RouteRegistry>({
                build: () => Promise.resolve([])
            })
        );

        handlerResolver.register(
            "GET",
            "/users",
            (request: Request) => Promise.resolve(
                Response.ok({})
            )
        );
    });

    it("registers a parameterized route", () => {

        const handlerResolver = new DefaultRouter(
            mock<RouteRegistry>({
                build: () => Promise.resolve([])
            })
        );

        handlerResolver.register(
            "GET",
            "/users/{userId}",
            (request: Request) => Promise.resolve(
                Response.ok({})
            )
        );
    });

    it("resolves a parameterized route", () => {

        const handlerResolver = new DefaultRouter(
            mock<RouteRegistry>({
                build: () => Promise.resolve([])
            })
        );

        handlerResolver.register(
            "GET",
            "/users/{userId}",
            (request: Request) => Promise.resolve(
                Response.ok("It works!")
            )
        );

        const handler = handlerResolver.resolve("GET", "/users/2");

        assert.deepEqual(handler.routeParameters, { userId: '2' });

        return handler
            .handler(
                mock<Request>()
            )
            .then((response: Response) => {
                assert.equal(response.content(), "It works!");
            });
    });

    it("resolves a not registered route", () => {
        
        const handlerResolver = new DefaultRouter(
            mock<RouteRegistry>({
                build: () => Promise.resolve([])
            })
        );

        const handler = handlerResolver.resolve("GET", "/health-check");

        assert.deepEqual(handler.routeParameters, { });

        return handler
            .handler(mock<Request>())
            .then((response: Response) => {
                assert.ok(response instanceof Response);
                assert.equal(response.statusCode(), 404);
                assert.deepEqual(response.content(), { error: "Resource not found." });
            });
    });
});