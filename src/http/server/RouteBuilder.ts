import "reflect-metadata";

import { Request, Response } from "..";
import { Container } from "../../core/Container";
import { MiddlewareRegistry, Middleware, coverAction, OriginalAction } from "./MiddlewareRegistry";
import { RouteAction } from "./Router";
import { RouteRegistry, RawRoute, RoutePrefix } from "./RouteRegistry";
import { ArgumentFetcher, DefaultFetchers, ArgumentFetcherRegistry } from "./ArgumentFetcherRegistry";

export interface RouteHandler {
    method: string;
    route: string;
    handler: (request: Request) => Promise<Response>;
}

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
        private middlewareRegistry: MiddlewareRegistry,
        private argumentFetcherRegistry: ArgumentFetcherRegistry
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
                    || argumentsTypes[argumentId] === Request
                    || this.argumentFetcherRegistry.has(argumentsTypes[argumentId])) continue;

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
            routePrefix = controllerClass[RoutePrefix] || "";

            finalHandler = this.createHandler(
                dependencies.get(currentRoute.controllerClass),
                originalHandler,
                this.createArgumentFetchers(
                    parseFunctionArgumentNames(originalHandler),
                    this.getArgumentTypes(controllerClass, currentRoute.handlerName),
                    dependencies
                )
            );

            finalHandler[OriginalAction] = originalHandler;

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
                        this.argumentFetcherRegistry.has(argumentTypes[argumentId])
                            ? this.argumentFetcherRegistry.get(argumentTypes[argumentId])
                            : DefaultFetchers.createServiceFetcher(
                                dependencies.get(argumentTypes[argumentId])
                            )
                    );
            }
        }

        return argumentFetchers;
    }
}