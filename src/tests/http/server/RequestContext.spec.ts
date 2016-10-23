import assert = require("assert");

import { RequestContext } from "../../../http/server/RequestContext";

describe("guppy.http.server.RequestContext", () => {

    it("can be instantiated", () => {

        class TestController {
            public test() { }
        }

        const requestContext = new RequestContext(TestController, 'test');

        assert.equal(requestContext.controllerClass, TestController);
        assert.equal(requestContext.methodName, 'test');
    });

});