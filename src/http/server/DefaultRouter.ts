import { Response } from "../Response";
import { Router, RouteAction, ResolvedRoute, Route } from "./Router";
import { RouteBuilder } from "./RouteBuilder";

export const NotFoundHandler = () => Promise.resolve(
    Response.notFound("Resource not found.")
);

export class DefaultRouter extends Router {

    private _handlers: Map<RegExp, { [method: string]: Route }> = new Map();

    public constructor(
        private routeBuilder: RouteBuilder
    ) {
        super();
    }

    public build(): Promise<void> {
        return this.routeBuilder
            .build()
            .then(routeHandlers => {

                let currentRouteHandler;

                for (let routeHandlerId in routeHandlers) {

                    currentRouteHandler = routeHandlers[routeHandlerId];

                    this.register(
                        currentRouteHandler.method,
                        currentRouteHandler.route,
                        currentRouteHandler.handler
                    );
                }
            });
    }

    public register(method: string, url: string, handler: RouteAction): void {

        const patternTemplate = url.replace(/\//g, "\\/").replace(/{[\w\d_-]+}/g, "([\\w\\u0430-\\u044f-_@]+)");
        const pattern = new RegExp(`^${patternTemplate}(?:$|\\?)`, "i");

        if (!this._handlers.has(pattern)) {
            this._handlers.set(pattern, {});
        }

        let parameterNames = url.match(/{[\w\d_-]+}/g);
        if (parameterNames !== null) {
            parameterNames = parameterNames.map(entry => entry.replace(/[}{]+/g, ""));
        } else {
            parameterNames = [];
        }

        this._handlers.get(pattern)[method] = {
            handler: handler,
            parameterNames: parameterNames
        };
    }

    public resolve(method: string, url: string): ResolvedRoute {

        let matches: string[];

        for (const pattern of this._handlers.keys()) {
            if ((matches = pattern.exec(url)) !== null && this._handlers.get(pattern).hasOwnProperty(method)) {
                const route = this._handlers.get(pattern)[method];

                return {
                    routeParameters: DefaultRouter.buildRouteParameters(matches, route.parameterNames),
                    handler: route.handler
                };
            }
        }

        return {
            routeParameters: {},
            handler: NotFoundHandler
        };
    }

    private static buildRouteParameters(matches: string[], parameterNames: string[]) {

        let result = {};

        for (const keyIndex in parameterNames) {
            const valueIndex = parseInt(keyIndex) + 1;
            result[
                parameterNames[keyIndex]
            ] = matches[valueIndex];
        }

        return result;
    }
}