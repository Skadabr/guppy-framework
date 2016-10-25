import assert = require("assert");

import { Request } from "../../../http";
import { HttpSession } from "../../../http/server";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpSession", () => {

    it("returns the message about invalid content", (done) => {

        const nativeRequest = mock({
            method: "GET",
            url: "/users",
            headers: {
                "content-type": "application/json"
            },
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        const nativeResponse = mock({
            statusCode: -1,
            end(content: string) {

            }
        });

        const httpSession = new HttpSession(nativeRequest, nativeResponse, "invalid json");

        try {
            httpSession.createRequest({});
        } catch (error) {
            assert.equal(error.message, "Invalid JSON in request.");
            done();
        }
    });

    it("returns the message about unsupported content-type", (done) => {

        const nativeRequest = mock({
            method: "GET",
            url: "/users",
            headers: {
                "content-type": "invalid/mime"
            },
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        const nativeResponse = mock({
            statusCode: -1,
            end(content: string) {

            }
        });

        const httpSession = new HttpSession(nativeRequest, nativeResponse, "");

        try {
            httpSession.createRequest({});
        } catch (error) {
            assert.equal(error.message, "Unsupported Content-Type. Given: invalid/mime.");
            done();
        }
    });

    it("does not parse body when content-type is omitted", () => {

        const nativeRequest = mock({
            method: "GET",
            url: "/users",
            headers: { },
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        const nativeResponse = mock({
            statusCode: -1,
            end(content: string) {

            }
        });

        const httpSession = new HttpSession(nativeRequest, nativeResponse, "some body data");

        const request = httpSession.createRequest({});

        assert.ok(request instanceof Request);
        assert.deepEqual(request.body, {});
    });
});