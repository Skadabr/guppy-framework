import { ResponseStatus, Response, Request } from "../../../http";
import { RequestHandlerFunction, RequestHandler, HandlerResolver } from "../../../http/server";

export const DEFAULT_HANDLER: RequestHandlerFunction = async (request: Request): Promise<Response> => {
    if (request.url() == "/users/1") return Response.ok({ route: "user #1" });
    if (request.url() == "/users") {
        if (request.method() == "POST") {
            return Response.json(ResponseStatus.Created, { route: "register a user" });
        } else {
            return Response.ok({ route: "list of users" });
        }
    }

    if (request.url() == "/") return Response.ok({ route: "homepage" });
    if (request.url() == "/debug") {
        return Response.ok({
            method: request.method(),
            url: request.url(),
            headers: request.headers,
            userAgent: request.header('User-Agent'),
            hasAuthorization: request.hasHeader('Authorization'),
            body: request.body
        });
    }

    return Response.notFound({ route: "not found" });
};

export class DefaultHandlerResolver implements HandlerResolver {

    registerHandler(method: string, url: string, handler: RequestHandlerFunction): void {
    }

    public resolve(method: string, url: string): RequestHandler {
        return {
            routeArguments: {},
            handler: DEFAULT_HANDLER,
            handlerArguments: [Request]
        };
    }
}