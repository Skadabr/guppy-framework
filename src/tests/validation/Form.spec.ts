import { Form } from "../../validation";

import assert = require("assert");

describe("guppy.validation.Form", () => {

    it("can be applied only to members", () => {
        assert.throws(
            () => {
                @Form()
                class TestController { }
            },
            /Annotation @Form doesn't support using with classes./
        );
    });
});