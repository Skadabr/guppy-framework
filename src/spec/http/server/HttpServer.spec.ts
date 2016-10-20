import test from "ava";
import * as fetch from "node-fetch";

import { HttpServer } from "../../../http/server/HttpServer";
import { ActionInvoker } from "../../../http/server/ActionInvoker";
import { DefaultHandlerResolver } from "./DefaultHandlerResolver";
import { RootPresenter } from "../../../presenter/RootPresenter";
import { ReducerRegistry } from "../../../http/server/ReducerRegistry";

let httpServer: HttpServer;

test.beforeEach(() => {
    httpServer = new HttpServer(
        new DefaultHandlerResolver(),
        new ActionInvoker(),
        new RootPresenter(),
        new ReducerRegistry()
    );
});

test.afterEach(() => httpServer.terminate());

test("starts a working http-server", async (t) => {

    await httpServer.listen(8911);

    let response: _fetch.Response;
    let responseContent: any;

    {
        response = await fetch('http://127.0.0.1:8911');
        responseContent = await response.json();

        t.is(response.status, 200);
        t.deepEqual(responseContent, { route: "homepage" });
    }

    {
        response = await fetch('http://127.0.0.1:8911/users');
        responseContent = await response.json();

        t.is(response.status, 200);
        t.deepEqual(responseContent, { route: "list of users" });
    }

    {
        response = await fetch('http://127.0.0.1:8911/users', { method: "POST" });
        responseContent = await response.json();

        t.is(response.status, 201);
        t.deepEqual(responseContent, { route: "register a user" });
    }

    {
        response = await fetch('http://127.0.0.1:8911/users/1');
        responseContent = await response.json();

        t.is(response.status, 200);
        t.deepEqual(responseContent, { route: "user #1" });
    }

    {
        response = await fetch('http://127.0.0.1:8911/invalid-route');
        responseContent = await response.json();

        t.is(response.status, 404);
        t.deepEqual(responseContent, {
            error: {
                route: "not found"
            }
        });
    }

    {
        response = await fetch('http://127.0.0.1:8911/debug', { method: "PATCH" });
        responseContent = await response.json();

        t.is(response.status, 200);
        t.deepEqual(responseContent, {
            method: "PATCH",
            url: "/debug",
            headers: {
                "accept-encoding": "gzip,deflate",
                "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
                "connection": "close",
                "accept": "*/*",
                "content-length": "0",
                "host": "127.0.0.1:8911"
            },
            userAgent: "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
            hasAuthorization: false,
            body: {}
        });
    }

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

        t.is(response.status, 200);
        t.deepEqual(responseContent, {
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

test("cannot start a http-server on a used port", async (t) => {

    await httpServer.listen(8912);

    t.throws(
        new HttpServer(
            new DefaultHandlerResolver(),
            new ActionInvoker(),
            new RootPresenter(),
            new ReducerRegistry()
        ).listen(8912),
        "listen EADDRINUSE :::8912"
    );

    await httpServer.terminate();
});

test("ignores a terminating of a not started http-server", async () => {
    
    await new HttpServer(
        new DefaultHandlerResolver(),
        new ActionInvoker(),
        new RootPresenter(),
        new ReducerRegistry()
    ).terminate();
});