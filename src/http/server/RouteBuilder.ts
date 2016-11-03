import { Request, Response } from "..";
import { Container } from "../../core/Container";

import "reflect-metadata";
import { MiddlewareRegistry, Middleware, coverAction} from "./MiddlewareRegistry";
import { RouteAction } from "./Router";
import { RouteRegistry, RawRoute } from "./RouteRegistry";

export interface RouteHandler {
    method: string;
    route: string;
    handler: (request: Request) => Promise<Response>;
}

export type ArgumentFetcher<T> = (request: Request) => T;

export const DefaultFetchers = {
    requestFetcher: (request: Request) => request,

    createStringFetcher(argumentName: string): ArgumentFetcher<string> {
        return (request: Request) => request.route[argumentName];
    },

    createNumberFetcher(argumentName: string): ArgumentFetcher<number> {
        return (request: Request) => parseInt(request.route[argumentName]);
    },

    createServiceFetcher<T>(service: T): ArgumentFetcher<T> {
        return (request: Request) => service;
    }
};

export function parseFunctionArgumentNames(originalHandler: Function) {

    let matches = originalHandler.toString().match(/^[^(]*\(([^)]*)\)/);
    let argumentsString = matches[1].replace(/\s+/, '');

    return argumentsString.length > 0
        ? argumentsString.split(',')
        : [];
}

export class RouteBuilder {

    public constructor(
        private container: Container,
        private routeRegistry: RouteRegistry,
        private middlewareRegistry: MiddlewareRegistry
    ) {
    }

    public build(): RouteHandler[] {

        let dependencies: Map<Function, Object> = new Map();
        let controllerClass: Function;
        let rawRoutes = this.routeRegistry.all();

        for (let routeId in rawRoutes) {
            controllerClass = rawRoutes[routeId].controllerClass;
            dependencies.set(controllerClass, this.container.get(controllerClass));

            const argumentsTypes = this.getArgumentTypes(controllerClass, rawRoutes[routeId].handlerName);

            for (let argumentId in argumentsTypes) {
                if (argumentsTypes[argumentId] === Object) {
                    throw new Error(
                        `All arguments types of ${controllerClass.name}#${rawRoutes[routeId].handlerName} must be declared.`
                    );
                }

                if (argumentsTypes[argumentId] === String
                    || argumentsTypes[argumentId] === Number
                    || argumentsTypes[argumentId] === Request) continue;

                dependencies.set(argumentsTypes[argumentId], this.container.get(argumentsTypes[argumentId]));
            }
        }

        let routeHandlers: RouteHandler[] = [];
        let originalHandler;
        let currentRoute: RawRoute;
        let routePrefix: string;
        let middlewares: Middleware[] = this.middlewareRegistry.middlewares().reverse();
        let finalHandler: RouteAction;

        for (let routeId in rawRoutes) {
            currentRoute = rawRoutes[routeId];
            controllerClass = currentRoute.controllerClass;
            originalHandler = controllerClass.prototype[currentRoute.handlerName];
            routePrefix = controllerClass["routePrefix"] || "";

            finalHandler = Object.assign(
                this.createHandler(
                    dependencies.get(currentRoute.controllerClass),
                    originalHandler,
                    this.createArgumentFetchers(
                        parseFunctionArgumentNames(originalHandler),
                        this.getArgumentTypes(controllerClass, currentRoute.handlerName),
                        dependencies
                    )
                ),
                { original: originalHandler }
            );

            for (let middlewareId in middlewares) {
                finalHandler = coverAction(middlewares[middlewareId], finalHandler);
            }

            routeHandlers.push({
                method: currentRoute.method,
                route: routePrefix + currentRoute.route,
                handler: finalHandler
            });
        }

        return routeHandlers;
    }

    private createHandler(
        controller: Object,
        originalHandler: Function,
        argumentFetchers: ArgumentFetcher<any>[]
    ) {
        return (request: Request) => originalHandler.apply(
            controller,
            argumentFetchers.map(argumentFetcher => argumentFetcher(request))
        );
    }

    private getArgumentTypes(targetClass: Function, methodName: string): Function[] {
        return Reflect.getMetadata("design:paramtypes", targetClass.prototype, methodName);
    }

    private createArgumentFetchers(
        argumentNames: string[],
        argumentTypes: Function[],
        dependencies: Map<Function, Object>
    ): ArgumentFetcher<any>[] {

        let argumentFetchers: ArgumentFetcher<any>[] = [];

        for (let argumentId in argumentTypes) {
            switch (argumentTypes[argumentId]) {
                case Request:
                    argumentFetchers.push(DefaultFetchers.requestFetcher);
                    break;

                case Number:
                    argumentFetchers.push(
                        DefaultFetchers.createNumberFetcher(argumentNames[argumentId])
                    );
                    break;

                case String:
                    argumentFetchers.push(
                        DefaultFetchers.createStringFetcher(argumentNames[argumentId])
                    );
                    break;

                default:
                    argumentFetchers.push(
                        DefaultFetchers.createServiceFetcher(
                            dependencies.get(argumentTypes[argumentId])
                        )
                    );
            }
        }

        return argumentFetchers;
    }
}