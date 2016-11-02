import { Response, Request } from "../../../http";
import { DefaultRouter, RouteBuilder } from "../../../http/server";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.DefaultRouter", () => {

    it("registers a route", () => {

        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => Promise.resolve([
                    {
                        method: "GET",
                        route: "/users",
                        handler: (request: Request) => Promise.resolve(
                            Response.ok({})
                        )
                    }
                ])
            })
        );

        router.build();
    });

    it("registers a parameterized route", () => {

        const router = new DefaultRouter(
            mock<RouteBuilder>({
                build: () => Promise.resolve([])
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
                build: () => Promise.resolve([])
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
                build: () => Promise.resolve([])
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