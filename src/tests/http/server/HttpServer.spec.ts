import assert = require("assert");
import net = require("net");
import * as fetch from "node-fetch";

import { HttpServer, ErrorHandlerRegistry, Router } from "../../../http/server";
import { Presenter, RootPresenter } from "../../../presenter";
import { Logger } from "../../../core";

import { StubRouter } from "./StubRouter";

let httpServer: HttpServer;

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpServer", () => {

    let debugBuffer = [];
    let errorBuffer = [];

    before(() => {
        debugBuffer = [];
        errorBuffer = [];
        httpServer = new HttpServer(
            new StubRouter(),
            new RootPresenter(),
            new ErrorHandlerRegistry(
                mock<Logger>({
                    error(message: string, ...data: any[]) {
                        errorBuffer.push(`${message} ${JSON.stringify(data)}`);
                    }
                })
            ),
            mock<Logger>({
                debug(message: string, ...data: any[]) {
                    debugBuffer.push(`${message} ${JSON.stringify(data)}`);
                },

                error(message: string, ...data: any[]) {
                    errorBuffer.push(`${message} ${JSON.stringify(data)}`);
                }
            })
        );
    });

    after(() => httpServer.terminate());

    it("starts a working http-server", async () => {

        await httpServer.listen(8911);

        let response: _fetch.Response;
        let responseContent: any;

        {
            response = await fetch(
                'http://127.0.0.1:8911/debug',
                {
                    method: "LOCK",
                    headers: {
                        Authorization: "Bearer xxx.yyy.zzz",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: "support@company.com" })
                }
            );
            responseContent = await response.json();

            assert.equal(response.status, 200);
            assert.deepEqual(responseContent, {
                method: "LOCK",
                url: "/debug",
                headers: {
                    "authorization": "Bearer xxx.yyy.zzz",
                    "content-type": "application/json",
                    "accept-encoding": "gzip,deflate",
                    "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
                    "connection": "close",
                    "accept": "*/*",
                    "host": "127.0.0.1:8911",
                    "transfer-encoding": "chunked"
                },
                userAgent: "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
                hasAuthorization: true,
                body: {
                    email: "support@company.com"
                }
            });
        }

        {
            response = await fetch("http://127.0.0.1:8911/error");
            responseContent = await response.json();

            assert.equal(response.status, 500);
            assert.deepEqual(responseContent, {
                "debugMessage": "Simulated error",
                "message": "Internal Server Error"
            });

            assert.deepEqual(debugBuffer, [
                `%s %s ["LOCK","/debug"]`,
                `%s %s ["GET","/error"]`
            ]);
        }

        await httpServer.terminate();
    });

    it("cannot start a http-server on a used port", () => {

        const secondServer = new HttpServer(
            new StubRouter(),
            new RootPresenter(),
            new ErrorHandlerRegistry(
                mock<Logger>()
            ),
            mock<Logger>()
        );

        return httpServer
            .listen(8912) // Start first server
            .then(() => secondServer.listen(8912)) // Try to start second server...
            .catch(error => error.message) // ... but we get an error
            .then(message => {
                assert.equal(message, "listen EADDRINUSE :::8912");
                httpServer.terminate(); // Stop first server
            });
    });

    it("ignores a terminating of a not started http-server", () => {

        return new HttpServer(
            new StubRouter(),
            new RootPresenter(),
            new ErrorHandlerRegistry(
                mock<Logger>()
            ),
            mock<Logger>()
        ).terminate();
    });

    it("returns default response when request cannot be handled", () => {
        
        const httpServer = new HttpServer(
            mock<Router>({
                build: () => Promise.resolve(),
                resolve() {
                    throw new Error("Cannot be presented");
                }
            }),
            mock<Presenter>(),
            new ErrorHandlerRegistry(
                mock<Logger>()
            ),
            mock<Logger>({
                debug(message: string, ...data: any[]) {
                    debugBuffer.push(`${message} ${JSON.stringify(data)}`);
                },

                error(message: string, ...data: any[]) {
                    errorBuffer.push(`${message} ${JSON.stringify(data)}`);
                }
            })
        );

        return httpServer.listen(8914)
            .then(() => fetch('http://127.0.0.1:8914'))
            .then(response => {
                assert.equal(response.status, 400);
                return response.json();
            })
            .then(response => {
                assert.deepEqual(response, {
                    "error": "Bad request."
                });
            })
            .then(() => httpServer.terminate());
    });

    it("returns default response for invalid requests", () => {
        
        const httpServer = new HttpServer(
            mock<Router>({
                build: () => Promise.resolve()
            }),
            mock<Presenter>(),
            new ErrorHandlerRegistry(
                mock<Logger>()
            ),
            mock<Logger>()
        );

        return httpServer
            .listen(8915)
            .then(() => new Promise((resolve, reject) => {
                const client = net.connect(8915, "127.0.0.1");

                client.on("error", reject);

                client.on("connect", () => {
                    client.write("GET / INVALID PROTOCOL");
                });

                let response = "";
                client.on("data", data => {
                    response = data.toString();
                    client.end();
                });

                client.on('end', () => {
                    assert.ok(response.indexOf("HTTP/1.1 400 Bad Request") > -1);
                    resolve();
                });
            }))
            .then(() => httpServer.terminate());
    });

});