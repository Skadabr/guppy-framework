import assert = require("assert");

import { Form, field, ValidationMiddleware } from "../../validation";
import { Request, Response } from "../../http";
import { OriginalAction } from "../../http/server";
import { IncomingMessage } from "http";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

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

        UserController.prototype.store[OriginalAction] = UserController.prototype.store;

        const validationMiddleware = new ValidationMiddleware();

        return validationMiddleware
            .handle(
                new Request(
                    mock<IncomingMessage>({
                        method: "POST",
                        url: "/users",
                        headers: {
                        },
                        connection: {
                            remoteAddress: "127.0.0.1"
                        }
                    }),
                    { email: "hello!" },
                    {},
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

        UserController.prototype.store[OriginalAction] = UserController.prototype.store;

        const validationMiddleware = new ValidationMiddleware();

        return validationMiddleware
            .handle(
                new Request(
                    mock<IncomingMessage>({
                        method: "POST",
                        url: "/users",
                        headers: {
                        },
                        connection: {
                            remoteAddress: "127.0.0.1"
                        }
                    }),
                    { name: "Alex", email: "alex@company.com" }, 
                    {},
                    {}
                ),
                UserController.prototype.store
            )
            .then((response: Response) => assert.ok(response instanceof Response));
    });

});