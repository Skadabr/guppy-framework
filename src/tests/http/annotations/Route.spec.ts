import assert = require('assert');

import { Route } from "../../../http";
import { RouteRegistry } from "../../../http/server/RouteRegistry";

describe('guppy.http.annotations.Route', () => {

    before(() => {
        RouteRegistry.prebootClear();
    });

    it("does not support using with members", () => {

        assert.throws(
            () => {
                @Route("GET", "/users")
                class UserController { }      
            }, 
            "Annotation doesn't support using with classes"
        );
    });

    it("registers metadata for members", () => {

        class UserController {
            @Route("GET", "/users/{userId}")
            public details(userId: number) { }
        }

        const routeRegistry = new RouteRegistry();

        let rawRoute = routeRegistry.all()[0];

        assert.equal(rawRoute.route, "/users/{userId}");
        assert.equal(rawRoute.method, "GET");
        assert.equal(rawRoute.controllerClass, UserController);
        assert.equal(rawRoute.handlerName, "details");
    });
});