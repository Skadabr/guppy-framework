import { Request } from "../Request";
import { Response } from "../Response";
import { RouteAction } from "./Router";

export const OriginalAction = Symbol("guppy.http.originalAction");

export interface Middleware {
    handle(request: Request, next: RouteAction): Promise<Response>;
}

export function coverAction(middleware: Middleware, action: RouteAction): RouteAction {
    const next = (request: Request) => middleware.handle(request, action);
    next[OriginalAction] = action[OriginalAction] || action;
    return next;
}

export class MiddlewareRegistry {

    private _middlewares: Middleware[] = [];

    public register(middleware: Middleware): void {
        this._middlewares.push(middleware);
    }

    public middlewares(): Middleware[] {
        return this._middlewares;
    }
}