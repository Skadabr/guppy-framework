import assert = require("assert");

import { ConsoleOutput } from "../../../console";
import { Request, Response } from "../../../http";
import { ActionInvoker } from "../../../http/server";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.ActionInvoker", () => {

    it("throws an error when arguments cannot be resolved", () => {
        const actionInvoker = new ActionInvoker(
            mock<ConsoleOutput>({
                error(message: string) {
                    assert.ok(message.indexOf(`Class "User" cannot be resolved as argument.`) > -1);
                }
            })
        );
        const request = new Request("GET", "/users", {}, {}, {}, "127.0.0.1", {});

        class User { }

        return actionInvoker
            .invoke(request, () => {}, [User])
            .then((response: Response) => {
                assert.ok(response instanceof Response);
                assert.equal(response.statusCode(), 500);
                assert.deepEqual(response.content(), { errorMessage: "Internal Server Error" });
                assert.deepEqual(response.headers(), { "Content-Type": "application/json" });
            });
    });

});