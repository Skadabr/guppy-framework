import { Get, Route } from "../../../http/annotations";
import assert = require("assert");

describe("guppy.http.annotations.Get", () => {

    it(`is an alias of Route("GET", ...)`, () => {
        assert.equal(
            Get("/users").toString(),
            Route("GET", "/users").toString()
        );
    });
});