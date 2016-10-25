import assert = require("assert");

import * as fetch from "node-fetch";

import { ConsoleOutput } from "../../../console";
import { Response } from "../../../http";
import { HttpServer, HandlerResolver, ReducerRegistry, ActionInvoker, RequestReducer, Reducer } from "../../../http/server";
import { DefaultHandlerResolver } from "./DefaultHandlerResolver";
import { Presenter, RootPresenter } from "../../../presenter";
import { ValidationError } from "../../../validation";
import net = require("net");

let httpServer: HttpServer;

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpServer", () => {

    before(() => {
        const reducerRegistry = new ReducerRegistry();

        reducerRegistry.registerRequestReducer(
            mock<RequestReducer>({
                modify: (value) => Promise.resolve(value)
            })
        );

        reducerRegistry.registerResponseReducer(
            mock<Reducer<Response>>({
                modify: (value) => Promise.resolve(value)
            })
        );

        httpServer = new HttpServer(
            new DefaultHandlerResolver(),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            new RootPresenter(),
            reducerRegistry
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

        await httpServer.terminate();
    });

    it("cannot start a http-server on a used port", (done) => {

        const secondServer = new HttpServer(
            new DefaultHandlerResolver(),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            new RootPresenter(),
            new ReducerRegistry()
        );

        httpServer
            .listen(8912) // Start first server
            .then(() => secondServer.listen(8912)) // Try to start second server...
            .catch(error => error.message) // ... but we get an error
            .then((message: string) => {
                assert.equal(message, "listen EADDRINUSE :::8912");
                httpServer.terminate(); // Stop first server
                done();
            });
    });

    it("ignores a terminating of a not started http-server", async () => {
        
        await new HttpServer(
            new DefaultHandlerResolver(),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            new RootPresenter(),
            new ReducerRegistry()
        ).terminate();
    });

    it("handles validation errors", () => {
        
        const httpServer = new HttpServer(
            mock<HandlerResolver>({
                resolve() {
                    throw new ValidationError([
                        new Error(`Field "name" cannot be empty.`)
                    ]);
                }
            }),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            new RootPresenter(),
            new ReducerRegistry()
        );

        return httpServer.listen(8913)
            .then(() => fetch('http://127.0.0.1:8913'))
            .then(response => {
                assert.equal(response.status, 500);
                return response.json();
            })
            .then(response => {
                assert.deepEqual(response, {
                    "children": [
                        "Field \"name\" cannot be empty."
                    ],
                    "error": "ValidationError",
                    "errorMessage": "Validation failed."
                });
            })
            .then(() => httpServer.terminate());
    });

    it("returns default response when request cannot be handled", () => {
        
        const httpServer = new HttpServer(
            mock<HandlerResolver>(),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            mock<Presenter>({
                present() {
                    throw new Error("Cannot be presented");
                }
            }),
            new ReducerRegistry()
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
            mock<HandlerResolver>(),
            new ActionInvoker(
                mock<ConsoleOutput>()
            ),
            mock<Presenter>({
                present() {
                    throw new Error("Cannot be presented");
                }
            }),
            new ReducerRegistry()
        );

        return httpServer.listen(8915)
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