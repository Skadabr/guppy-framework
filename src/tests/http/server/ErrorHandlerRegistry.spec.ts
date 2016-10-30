import assert = require("assert");

import { Response } from "../../../http";
import { ErrorHandlerRegistry, ErrorHandler } from "../../../http/server";

describe("guppy.http.server.ErrorHandlerRegistry", () => {

    class EntityNotFound extends Error {
        constructor(entityName) {
            super(`${entityName} was not found.`);
            this.name = "EntityNotFound";
        }
    }

    class EntityNotFoundHandler implements ErrorHandler {

        handle(error: EntityNotFound): Response {
            return Response.notFound({
                message: error.message
            });
        }
    }

    it("handlers unknown errors via default handler", () => {

        const errorHandlerRegistry = new ErrorHandlerRegistry();
        const error = new EntityNotFound("User");

        const response = errorHandlerRegistry.handle(error);

        assert.equal(response.statusCode(), 500);
        assert.deepEqual(response.content(), {
            "developerMessage": "User was not found.",
            "userMessage": "Internal Server Error"
        });
        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json"
        });
    });

    it("handlers known errors via registered handler", () => {

        const errorHandlerRegistry = new ErrorHandlerRegistry();
        const error = new EntityNotFound("User");

        errorHandlerRegistry.register(EntityNotFound, new EntityNotFoundHandler());

        const response = errorHandlerRegistry.handle(error);

        assert.equal(response.statusCode(), 404);
        assert.deepEqual(response.content(), {
            "message": "User was not found."
        });
        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json"
        });
    });
});
