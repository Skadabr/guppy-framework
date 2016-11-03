import { Response, Request } from "../../../http";
import { DefaultRouter, RouteBuilder, parseFunctionArgumentNames } from "../../../http/server";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.parseFunctionArgumentNames", () => {

    it("parses a function without arguments", () => {

        assert.deepEqual(
            parseFunctionArgumentNames(function() {
            }),
            []
        );
    });

    it("parses a function with arguments", () => {

        assert.deepEqual(
            parseFunctionArgumentNames(function(firstName, lastName) {
            }),
            ["firstName", "lastName"]
        );
    });

    it("parses an arrow function without arguments", () => {

        assert.deepEqual(
            parseFunctionArgumentNames(() => {}),
            []
        );
    });

    it("parses a function with arguments", () => {

        assert.deepEqual(
            parseFunctionArgumentNames((firstName, lastName) => {}),
            ["firstName", "lastName"]
        );
    });
});

describe("guppy.http.server.DefaultRouter", () => {

    it("registers a route", () => {

        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => [
                    {
                        method: "GET",
                        route: "/users",
                        handler: (request: Request) => Promise.resolve(
                            Response.ok({})
                        )
                    }
                ]
            })
        );

        router.build();
    });

    it("registers a parameterized route", () => {

        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => []
            })
        );

        router.register(
            "GET",
            "/users/{userId}",
            (request: Request) => Promise.resolve(
                Response.ok({})
            )
        );
    });

    it("resolves a parameterized route", () => {

        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => []
            })
        );

        router.register(
            "GET",
            "/users/{userId}",
            (request: Request) => Promise.resolve(
                Response.ok("It works!")
            )
        );

        const handler = router.resolve("GET", "/users/2");

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
        
        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => []
            })
        );

        const handler = router.resolve("GET", "/health-check");

        assert.deepEqual(handler.routeParameters, { });

        return handler
            .handler(mock<Request>())
            .then((response: Response) => {
                assert.ok(response instanceof Response);
                assert.equal(response.statusCode(), 404);
                assert.deepEqual(response.content(), { message: "Resource not found." });
            });
    });
});