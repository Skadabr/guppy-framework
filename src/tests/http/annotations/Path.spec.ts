import assert = require('assert');

import { Path } from "../../../http";
import { RouteRegistry } from "../../../http/server/RouteRegistry";

describe('guppy.http.annotations.Path', () => {

    before(() => {
        RouteRegistry.prebootClear();
    });

    it("registers metadata for classes", () => {

        @Path('/users')
        class UserController { }

        assert.equal(UserController["routePrefix"], "/users");
    });

    it("does not support using with members", () => {

        assert.throws(
            () => {
                class UserController {
                    @Path('/users/{userId}')
                    public details(userId: number) { }
                }
            },
            "Annotation @Path doesn't support using with members"
        );
    });
});