import { DefaultHandlerResolver, NotFoundHandler } from "../../../http/server";
import { Response } from "../../../http";

import assert = require("assert");

describe("guppy.http.server.DefaultHandlerResolver", () => {

    it("registers a route", () => {
        class UserController {
            list() {}
        }

        const handlerResolver = new DefaultHandlerResolver();

        handlerResolver.registerHandler("GET", "/users", UserController, "list", []);
    });

    it("registers a parameterized route", () => {
        class UserController {
            details() {}
        }

        const handlerResolver = new DefaultHandlerResolver();

        handlerResolver.registerHandler("GET", "/users/{userId}", UserController, "details", []);
    });

    it("resolves a parameterized route", () => {
        class UserController {
            details() {}
        }

        const handlerResolver = new DefaultHandlerResolver();

        handlerResolver.registerHandler("GET", "/users/{userId}", UserController, "details", []);

        const handler = handlerResolver.resolve("GET", "/users/2");

        assert.deepEqual(handler.routeArguments, { userId: '2' });
        assert.equal(handler.controller, UserController);
        assert.equal(handler.methodName, "details");
        assert.deepEqual(handler.handlerArguments, []);
    });

    it("resolves a not registered route", () => {
        
        const handlerResolver = new DefaultHandlerResolver();
        const handler = handlerResolver.resolve("GET", "/health-check");

        assert.deepEqual(handler.routeArguments, { });
        assert.deepEqual(handler.controller, { notFound: NotFoundHandler });
        assert.equal(handler.methodName, "notFound");
        assert.deepEqual(handler.handlerArguments, []);

        return handler.controller[handler.methodName]()
            .then((response: Response) => {
                assert.ok(response instanceof Response);
                assert.equal(response.statusCode(), 404);
                assert.deepEqual(response.content(), { error: "Resource not found." });
            });
    });
});