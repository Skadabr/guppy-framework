import { Request } from "../../http";

import assert = require("assert");

describe("guppy.http.Request", () => {

    it("can be instantiated", () => {

        let request: Request = new Request(
            "PATCH",
            "/users/8",
            { "content-type": "application/json" },
            { name: "Alex" },
            { userId: "8" },
            "127.0.0.1"        
        );

        assert.equal(request.method(), "PATCH");
        assert.equal(request.url(), "/users/8");
        assert.equal(request.hasHeader("content-type"), true);
        assert.deepEqual(request.headers, { "content-type": "application/json" });
        assert.equal(request.hasHeader("authorization"), false);
        assert.equal(request.header("content-type"), "application/json");
        assert.deepEqual(request.body, { name: "Alex" });
        assert.deepEqual(request.route, { userId: "8" });
        assert.equal(request.remoteAddress, "127.0.0.1");
        assert.deepEqual(request.query, {});
    });

    it("can be instantiated with query", () => {

        let request: Request = new Request(
            "GET",
            "/users",
            { "content-type": "application/json" },
            { },
            { },
            "172.17.0.1",
            { page: "3" }
        );

        assert.equal(request.method(), "GET");
        assert.equal(request.url(), "/users");
        assert.equal(request.hasHeader("content-type"), true);
        assert.deepEqual(request.headers, { "content-type": "application/json" });
        assert.equal(request.hasHeader("authorization"), false);
        assert.equal(request.header("content-type"), "application/json");
        assert.deepEqual(request.body, { });
        assert.deepEqual(request.route, { });
        assert.equal(request.remoteAddress, "172.17.0.1");
        assert.deepEqual(request.query, { page: "3" });
    });
});