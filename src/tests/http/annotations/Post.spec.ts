import { Post, Route } from "../../../http";
import assert = require("assert");

describe("guppy.http.annotations.Post", () => {

    it(`is an alias of Route("POST", ...)`, () => {
        assert.equal(
            Post("/users").toString(),
            Route("POST", "/users").toString()
        );
    });
});