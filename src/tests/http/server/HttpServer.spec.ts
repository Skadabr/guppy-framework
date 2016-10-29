import assert = require("assert");

import * as fetch from "node-fetch";

import { HttpServer } from "../../../http/server";
import { StubRouter } from "./StubRouter";
import { Presenter, RootPresenter } from "../../../presenter";
import { Router } from "../../../http/server/Router";

import net = require("net");

let httpServer: HttpServer;

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.HttpServer", () => {

    before(() => {
        httpServer = new HttpServer(
            new StubRouter(),
            new RootPresenter()
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
            new StubRouter(),
            new RootPresenter()
        );

        httpServer
            .listen(8912) // Start first server
            .then(() => secondServer.listen(8912)) // Try to start second server...
            .catch(error => error.message) // ... but we get an error
            .then(message => {
                assert.equal(message, "listen EADDRINUSE :::8912");
                httpServer.terminate(); // Stop first server
                done();
            });
    });

    it("ignores a terminating of a not started http-server", () => {

        return new HttpServer(new StubRouter(), new RootPresenter())
            .terminate();
    });

    it("returns default response when request cannot be handled", () => {
        
        const httpServer = new HttpServer(
            mock<Router>({
                build: () => Promise.resolve(),
                resolve() {
                    throw new Error("Cannot be presented");
                }

            }),
            mock<Presenter>({
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
            mock<Presenter>()
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