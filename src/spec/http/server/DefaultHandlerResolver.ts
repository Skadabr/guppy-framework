import { ResponseStatus, Response, Request } from "../../../http";
import { RequestHandler, HandlerResolver } from "../../../http/server";

export const DEFAULT_HANDLER = async (request: Request): Promise<Response> => {
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

    public registerHandler(
        method: string,
        url: string,
        controller: Object,
        methodName: string,
        handlerArguments: Function[]
    ): void {

    }

    public resolve(method: string, url: string): RequestHandler {
        return {
            routeArguments: {},
            controller: { default: DEFAULT_HANDLER },
            methodName: "default",
            handlerArguments: [Request]
        };
    }
}