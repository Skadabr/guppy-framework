import assert = require("assert");

import { MiddlewareRegistry, RouteAction, coverAction, OriginalAction } from "../../../http/server";
import { Request, Response } from "../../../http";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.MiddlewareRegistry", () => {

    it("returns registered request reducers", () => {

        const middlewareRegistry = new MiddlewareRegistry();

        const firstMiddleware = { handle: (request: Request, next: RouteAction) => next(request) };
        const secondMiddleware = { handle: (request: Request, next: RouteAction) => next(request) };

        middlewareRegistry.register(firstMiddleware);
        middlewareRegistry.register(secondMiddleware);

        const middlewares = middlewareRegistry.middlewares();

        assert.equal(middlewares[0], firstMiddleware);
        assert.equal(middlewares[1], secondMiddleware);
    });
});

describe("guppy.http.server.coverAction", () => {

    it("covers a request handler by middleware", () => {

        const middleware = {
            handle(request: Request, next: RouteAction) {
                return next(request)
                    .then((response: Response) => {
                        response.content()["message"] = `${response.content()["message"]} (no).`;
                        return response;
                    });
            }
        };

        const requestHandler = (request: Request) => Promise.resolve(
            Response.ok({
                message: "It works"
            })
        );

        const finalHandler = coverAction(middleware, requestHandler);

        assert.equal(finalHandler[OriginalAction], requestHandler);

        return finalHandler(mock<Request>())
            .then((response: Response) => {
                assert.equal(response.content()["message"], "It works (no).");
            });
    });
});