import assert = require("assert");

import { Container } from "../../../core";
import { Path, Get, Request, Response } from "../../../http";
import { RouteBuilder, RouteHandler, RouteRegistry, MiddlewareRegistry } from "../../../http/server";
import {IncomingMessage} from "http";
import {RouteAction} from "../../../http/server/Router";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.RouteBuilder", () => {

    it("throws an error on route building for non registered controller", () => {

        RouteRegistry.prebootClear();

        class UserController {

            constructor(someDependency: Number) {
                
            }

            @Get("/users")
            all(userId: number, userSlug: string) { }
        }

        const container: Container = new Container();
        const routeRegistry: RouteRegistry = new RouteRegistry();
        const middlewareRegistry: MiddlewareRegistry = new MiddlewareRegistry();
        const routeBuilder: RouteBuilder = new RouteBuilder(container, routeRegistry, middlewareRegistry);

        assert.throws(
            () => routeBuilder.build(),
            /Service "UserController" is not registered./
        );
    });


    it("throws an error on route building for action with non typed arguments", () => {
        RouteRegistry.prebootClear();

        class UserController {

            @Get("/users")
            all(userId) { }
        }

        const container: Container = new Container();
        const routeRegistry: RouteRegistry = new RouteRegistry();
        const middlewareRegistry: MiddlewareRegistry = new MiddlewareRegistry();
        const routeBuilder: RouteBuilder = new RouteBuilder(container, routeRegistry, middlewareRegistry);

        assert.throws(
            () => routeBuilder.build(),
            /All arguments types of UserController#all must be declared./
        );
    });

    it("builds an independent handler", () => {

        RouteRegistry.prebootClear();

        @Path("/users")
        class UserController {

            @Get("/{userId}/{userSlug}")
            details(userId: number, userSlug: string, request: Request, routeRegistry: RouteRegistry) {

                return Promise.resolve(
                    Response.ok({
                        routesCount: routeRegistry.all().length,
                        originalUserId: request.route["userId"],
                        userId: userId,
                        userSlug: userSlug
                    })
                );
            }
        }

        const container: Container = new Container();
        const routeRegistry: RouteRegistry = new RouteRegistry();
        const middlewareRegistry: MiddlewareRegistry = new MiddlewareRegistry();
        const routeBuilder: RouteBuilder = new RouteBuilder(container, routeRegistry, middlewareRegistry);

        container.service(RouteRegistry, routeRegistry);

        const routeHandlers: RouteHandler[] = routeBuilder.build();

        assert.equal(routeHandlers.length, 1);
        assert.equal(routeHandlers[0].method, "GET");
        assert.equal(routeHandlers[0].route, "/users/{userId}/{userSlug}");

        return routeHandlers[0]
            .handler(
                new Request(
                    mock<IncomingMessage>({
                        method: "GET",
                        url: "/users/1/Alex",
                        headers: { },
                        connection: {
                            remoteAddress: "127.0.0.1"
                        }
                    }),
                    {},
                    { userId: "1", userSlug: "Alex" },
                    {}
                )
            )
            .then((response: Response) => {
                assert.deepEqual(response.content(), {
                    "routesCount": 1,
                    originalUserId: "1",
                    userId: 1,
                    userSlug: "Alex"
                });
            });
    });

    it("builds a handler covered by middlewares", () => {

        RouteRegistry.prebootClear();

        class UserController {

            @Get("/users")
            list() {
                return Promise.resolve(
                    Response.ok({ message: "List of Users" })
                );
            }
        }

        const container: Container = new Container();
        const routeRegistry: RouteRegistry = new RouteRegistry();
        const middlewareRegistry: MiddlewareRegistry = new MiddlewareRegistry();
        const routeBuilder: RouteBuilder = new RouteBuilder(container, routeRegistry, middlewareRegistry);

        container.service(RouteRegistry, routeRegistry);

        middlewareRegistry.register({
            handle: (request: Request, next: RouteAction): Promise<Response> => {
                return next(request)
                    .then((response: Response) => {
                        const content = response.content();
                        content["anotherMessage"] = "From Middleware";
                        return response.setContent(content);
                    })
            }
        });

        const routeHandlers: RouteHandler[] = routeBuilder.build();

        assert.equal(routeHandlers.length, 1);
        assert.equal(routeHandlers[0].method, "GET");
        assert.equal(routeHandlers[0].route, "/users");

        return routeHandlers[0]
            .handler(
                new Request(
                    mock<IncomingMessage>({
                        method: "GET",
                        url: "/users/1/Alex",
                        headers: { },
                        connection: {
                            remoteAddress: "127.0.0.1"
                        }
                    }),
                    {},
                    {},
                    {}
                )
            )
            .then((response: Response) => {
                assert.deepEqual(response.content(), {
                    anotherMessage: "From Middleware",
                    message: "List of Users"
                });
            });
    });

});
