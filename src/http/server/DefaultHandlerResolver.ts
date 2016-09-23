import { Response } from "../Response";
import { HandlerResolver, RequestHandler, RequestHandlerFunction } from "./HandlerResolver";

export const NotFoundHandler = async () => Response.notFound("Resource not found.");

export class DefaultHandlerResolver implements HandlerResolver {

    private _handlers: Map<RegExp, { [method: string]: Object }> = new Map();

    public registerHandler(method: string, route: string, handler: RequestHandlerFunction, handlerArguments: Function[]) {

        const patternTemplate = route.replace(/\//g, "\\/").replace(/{[\w\d_-]+}/g, "([\\w\\u0430-\\u044f-_@]+)");
        const pattern = new RegExp(`^${patternTemplate}(?:$|\\?)`, "i");

        if ( ! this._handlers.has(pattern)) {
            this._handlers.set(pattern, {});
        }

        let parameterNames = route.match(/{[\w\d_-]+}/g);
        if (parameterNames !== null) {
            parameterNames = parameterNames.map(entry => entry.replace(/[}{]+/g, ''));
        } else {
            parameterNames = [];
        }

        this._handlers.get(pattern)[method] = {
            handler: handler,
            route: route,
            parameterNames: parameterNames,
            handlerArguments: handlerArguments
        };
    }

    public resolve(method: string, url: string): RequestHandler {

        let matches: string[];

        for (const pattern of this._handlers.keys()) {
            if ((matches = pattern.exec(url)) !== null && this._handlers.get(pattern).hasOwnProperty(method)) {
                const route = this._handlers.get(pattern)[method];
                return {
                    routeArguments: DefaultHandlerResolver.buildArgumentsMap(matches, route["parameterNames"]),
                    handler: route["handler"],
                    handlerArguments: route["handlerArguments"]
                };
            }
        }

        return {
            routeArguments: {},
            handler: NotFoundHandler,
            handlerArguments: []
        };
    }

    private static buildArgumentsMap(matches: string[], parameterNames: string[]) {
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