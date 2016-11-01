import assert = require("assert");

import { Request } from "../../../http";
import { HttpSession } from "../../../http/server";
import {Response} from "../../../http/Response";
import {Presenter} from "../../../presenter/Presenter";
import {IncomingMessage} from "http";
import {ServerResponse} from "http";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpSession", () => {

    it("returns the message about invalid content", () => {

        const nativeRequest = mock({
            method: "POST",
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

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            "invalid json"
        );

        assert.throws(
            () => httpSession.createRequest({}),
            /Invalid JSON in request./
        );
    });

    it("returns the message about unsupported content-type", () => {

        const nativeRequest = mock({
            method: "POST",
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

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            ""
        );

        assert.throws(
            () => httpSession.createRequest({}),
            /Unsupported Content-Type. Given: invalid\/mime./
        );
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

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            "some body data"
        );

        const request = httpSession.createRequest({});

        assert.ok(request instanceof Request);
        assert.deepEqual(request.body, {});
    });

    it("does not send body for HEAD and for 204 (No Content)", (done) => {

        const nativeRequest = mock({
            method: "HEAD",
            url: "/users",
            headers: { "content-type": "application/json" },
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        let responseHeaders = {};
        let responseData = "";

        const nativeResponse = mock({
            statusCode: -1,
            setHeader(header, value) {
                responseHeaders[header] = value;
            },
            write() {
                throw new Error("Test shouldn't run it.");
            },
            end() {
                assert.equal(nativeResponse["statusCode"], 200);
                assert.deepEqual(responseHeaders, {
                    "Content-Type": "application/json",
                    "Count": 2
                });
                assert.equal(responseData, "");
                done();
            }
        });

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            ""
        );
        const presenter = mock<Presenter>({});
        const response = Response.list([
            { id: 1, name: "Bill" },
            { id: 2, name: "John" }
        ]);

        httpSession.sendResponse(response, presenter);
    });

    it("sends body for usual response", (done) => {

        const nativeRequest = mock({
            method: "GET",
            url: "/users",
            headers: { "content-type": "application/json" },
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        let responseHeaders = {};
        let responseData = "";
        const nativeResponse = mock({
            statusCode: -1,
            setHeader(header, value) {
                responseHeaders[header] = value;
            },
            write(data: string) {
                responseData += data;
            },
            end() {
                assert.equal(nativeResponse["statusCode"], 200);
                assert.deepEqual(responseHeaders, {
                    "Content-Length": "47",
                    "Content-Type": "application/json",
                    "Count": 2
                });
                assert.equal(responseData, `[{"id":1,"name":"Bill"},{"id":2,"name":"John"}]`);
                done();
            }
        });

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            ""
        );
        const presenter = mock<Presenter>({ present: content => content });
        const response = Response.list([
            { id: 1, name: "Bill" },
            { id: 2, name: "John" }
        ]);

        httpSession.sendResponse(response, presenter);
    });

    it("streams data for streaming response", (done) => {

        const nativeRequest = mock({
            method: "GET",
            url: "/users.csv",
            connection: {
                remoteAddress: "127.0.0.1"
            }
        });

        let responseHeaders = {};
        let responseData = "";
        const nativeResponse = mock({
            statusCode: -1,
            setHeader(header, value) {
                responseHeaders[header] = value;
            },
            write(data: string) {
                responseData += data;
            },
            end() {
                assert.equal(nativeResponse["statusCode"], 200);
                assert.deepEqual(responseHeaders, {
                    "Content-Type": "text/csv"
                });
                assert.equal(responseData, `1, Bill\n2, John\n`);
                done();
            }
        });

        const httpSession = new HttpSession(
            mock<IncomingMessage>(nativeRequest),
            mock<ServerResponse>(nativeResponse),
            ""
        );
        const presenter = mock<Presenter>({ present: content => content });
        const response = Response.stream(stream => {
            stream.write("1, Bill\n");
            stream.write("2, John\n");
            stream.end();
        }, { "Content-Type": "text/csv" });

        httpSession.sendResponse(response, presenter);
    });
});