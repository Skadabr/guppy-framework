import { Request } from "../Request";
import { Response } from "../Response";

export type RouteParamaterSet = { [key: string]: string };

export type RouteAction = (request: Request) => Promise<Response>;

export interface Route {
    parameterNames: string[];
    handler: RouteAction;
}

export interface ResolvedRoute {
    routeParameters: RouteParamaterSet;
    handler: RouteAction;
}

export abstract class Router {
    public abstract build(): void;
    public abstract register(method: string, url: string, handler: RouteAction): void;
    public abstract resolve(method: string, url: string): ResolvedRoute;
}