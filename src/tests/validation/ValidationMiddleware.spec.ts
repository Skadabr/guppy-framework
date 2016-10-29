import assert = require("assert");

import { Form, field, ValidationMiddleware } from "../../validation";
import { Request } from "../../http";
import { Response } from "../../http/Response";

describe("guppy.validation.ValidationMiddleware", () => {

    it("denies invalid request", () => {

        class UserController {
            @Form(
                field("name").required().isString().trim(),
                field("email").required().isEmail().trim()
            )
            store(request: Request) {
                return Promise.resolve(
                    Response.ok({})
                );
            }
        }

        UserController.prototype.store["original"] = UserController.prototype.store;

        const validationMiddleware = new ValidationMiddleware();

        return validationMiddleware
            .handle(
                new Request(
                    "POST", 
                    "/users",
                    {},
                    { email: "hello!" }, 
                    {},
                    "127.0.0.1", 
                    {}
                ),
                UserController.prototype.store
            )
            .then((response: Response) => {
                assert.deepEqual(response.content(), {
                    "children": [
                        `Field "name" is required.`,
                        `Field "email" must be an email.`
                    ],
                    "errorMessage": "Validation failed."
                });
            });
    });

    it("accepts correct requests", () => {

        class UserController {
            @Form(
                field("name").required().isString().trim(),
                field("email").required().isEmail().trim()
            )
            store(request: Request) {
                return Promise.resolve(
                    Response.ok({})
                );
            }
        }

        UserController.prototype.store["original"] = UserController.prototype.store;

        const validationMiddleware = new ValidationMiddleware();

        return validationMiddleware
            .handle(
                new Request(
                    "POST", 
                    "/users",
                    {},
                    { name: "Alex", email: "alex@company.com" }, 
                    {},
                    "127.0.0.1", 
                    {}
                ),
                UserController.prototype.store
            )
            .then((response: Response) => assert.ok(response instanceof Response));
    });

});