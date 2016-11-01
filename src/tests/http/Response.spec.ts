import assert = require("assert");

import { Response, ResponseStream } from "../../http";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.Response", () => {

    it("creates a json response", () => {

        let response = Response.json(
            406,
            { email: "E-Mail has invalid format." },
            { "Request-ID": "hv3m457ynov23t4" }
        );

        assert.equal(response.statusCode(), 406);

        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json",
            "Request-ID": "hv3m457ynov23t4"
        });

        assert.deepEqual(response.content(), { 
            email: "E-Mail has invalid format." 
        });
    });

    it("creates an ok message", () => {

        let response = Response.ok(
            { id: 1, name: "Alex" },
            { "Request-ID": "hv3m457ynov23t4" }
        );

        assert.equal(response.statusCode(), 200);
        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json",
            "Request-ID": "hv3m457ynov23t4"
        });

        assert.deepEqual(response.content(), { 
            id: 1,
            name: "Alex" 
        });
    });

    it("creates a list of items", () => {

        let response = Response.list(
            [
                { userId: 3 },
                { userId: 4 }
            ],
            { "Request-ID": "sbw5bwqv3t5b2" }
        );

        assert.equal(response.statusCode(), 200);
        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json",
            "Request-ID": "sbw5bwqv3t5b2",
            "Count": 2
        });

        assert.deepEqual(response.content(), [
            { userId: 3 },
            { userId: 4 }
        ]);
    });

    it("creates a not found message", () => {

        let response = Response.notFound(
            { message: "User #12 was not found" },
            { "Request-ID": "g9m8y3454vn8" }
        );

        assert.equal(response.statusCode(), 404);
        assert.deepEqual(response.headers(), {
            "Content-Type": "application/json",
            "Request-ID": "g9m8y3454vn8"
        });

        assert.deepEqual(response.content(), {
            message: "User #12 was not found"
        });
    });

    it("streams data", () => {

        let response = Response.stream(
            (stream: ResponseStream) => {
                stream.write(`ID, Name\n`);
                stream.write(`1, John\n`);
                stream.write(`2, Bill\n`);
                stream.end();
            },
            {
                "Content-Type": "text/csv"
            }
        );

        assert.equal(response.statusCode(), 200);
        assert.deepEqual(response.headers(), { "Content-Type": "text/csv" });

        assert.equal(response.content(), null);
        assert.ok(response.streamWriter instanceof Function);

        let content = "";

        response.streamWriter(
            mock<ResponseStream>({
                write(chunk) {
                    content += chunk
                },

                end(chunk) {
                    if (chunk !== void 0) content += chunk;
                }
            })
        );

        assert.deepEqual(content, `ID, Name\n1, John\n2, Bill\n`);
    });

});