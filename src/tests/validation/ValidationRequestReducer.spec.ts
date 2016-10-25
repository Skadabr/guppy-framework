import assert = require("assert");

import { ValidationRequestReducer, Form, field, ValidationError } from "../../validation";
import { Request } from "../../http";
import { RequestContext } from "../../http/server/RequestContext";

describe("guppy.validation.ValidationRequestReducer", () => {

    it("applies registered contraints to requests", () => {

        class UserController {
            @Form(
                field("name").required().isString().trim(),
                field("email").required().isEmail().trim(),
            )
            store(request: Request) { }
        }

        const validationRequestReducer = new ValidationRequestReducer();

        return validationRequestReducer
            .modify(
                new Request(
                    "POST", 
                    "/users",
                    {},
                    { email: "hello!" }, 
                    {},
                    "127.0.0.1", 
                    {}
                ),
                new RequestContext(UserController, "store")
            )
            .catch(error => error)
            .then((error: ValidationError) => {
                assert.equal(error.name, "ValidationError");
                assert.equal(error.message, "Validation failed.");
                assert.equal(error.violations.length, 2);
                assert.ok(error.violations[0] instanceof Error);
                assert.ok(error.violations[1] instanceof Error);
                assert.equal(error.violations[0].message, `Field "name" is required.`);
                assert.equal(error.violations[1].message, `Field "email" must be an email.`);
            });
    });

});