import { Request, Response } from "..";
import { Container } from "../../core/Container";

import "reflect-metadata";
import {MiddlewareRegistry, Middleware, coverAction} from "./MiddlewareRegistry";
import {RouteAction} from "./Router";

export interface RawRoute {
    method: string;
    route: string;
    controllerClass: Function;
    handlerName: string;
}

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

export class RouteRegistry {

    private static prebootRawRoutes: RawRoute[] = [];

    public static prebootClear() {
        RouteRegistry.prebootRawRoutes.length = 0;
    }

    public static prebootRegister(rawRoute: RawRoute) {
        RouteRegistry.prebootRawRoutes.push(rawRoute);
    }

    public static prebootAll(): RawRoute[] {
        return RouteRegistry.prebootRawRoutes;
    }

    private rawRoutes: RawRoute[] = [];

    public constructor(
        private container: Container,
        private middlewareRegistry: MiddlewareRegistry,
        ignorePrebootData?: boolean
    ) {
        if (!ignorePrebootData) {
            this.rawRoutes = this.rawRoutes.concat(RouteRegistry.prebootRawRoutes);
        }
    }

    public register(rawRoute: RawRoute) {
        this.rawRoutes.push(rawRoute);
    }

    public all(): RawRoute[] {
        return this.rawRoutes;
    }

    public build(): Promise<RouteHandler[]> {

        let dependencyPromises = new Map<string, Promise<Object>>();
        let controllerClass: Function;

        for (let routeId in this.rawRoutes) {
            controllerClass = this.rawRoutes[routeId].controllerClass;
            dependencyPromises.set(controllerClass.name, this.container.get(controllerClass));
        }

        let dependencies: Map<Function, Object> = new Map();

        return Promise
            .all(dependencyPromises.values())
            .then((fetchedDependencies: Object[]) => {
                for (let dependencyId in fetchedDependencies) {
                    dependencies.set(
                        fetchedDependencies[dependencyId].constructor,
                        fetchedDependencies[dependencyId]
                    );
                }
            })
            .then(() => {

                let routeHandlers: RouteHandler[] = [];
                let originalHandler;
                let currentRoute: RawRoute;
                let routePrefix: string;
                let middlewares: Middleware[] = this.middlewareRegistry.middlewares().reverse();
                let finalHandler: RouteAction;

                for (let routeId in this.rawRoutes) {
                    currentRoute = this.rawRoutes[routeId];
                    controllerClass = currentRoute.controllerClass;
                    originalHandler = controllerClass.prototype[currentRoute.handlerName];
                    routePrefix = controllerClass["routePrefix"] || "";

                    finalHandler = Object.assign(
                        this.createHandler(
                            dependencies.get(currentRoute.controllerClass),
                            originalHandler,
                            this.createArgumentFetchers(
                                this.parseArgumentNames(originalHandler),
                                this.getArgumentTypes(controllerClass, currentRoute.handlerName),
                                dependencies,
                                `${controllerClass.name}#${currentRoute.handlerName}` // UserController#details
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
            });
    }

    private parseArgumentNames(originalHandler: Function) {

        let matches = originalHandler.toString().match(/^[^(]+\(([^)]*)\)/);

        if (!matches) {
            throw new Error("Cannot parse argument list");
        }

        let argumentsString = matches[1].replace(/\s+/, '');

        return argumentsString.length > 0
            ? argumentsString.split(',')
            : [];
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
        dependencies: Map<Function, Object>,
        fullHandlerName: string
    ): ArgumentFetcher<any>[] {

        let argumentFetchers: ArgumentFetcher<any>[] = [];

        for (let argumentId in argumentTypes) {
            switch (argumentTypes[argumentId]) {
                case Object:
                    throw new Error(`Type of "${argumentNames[argumentId]}" at ${fullHandlerName} must be declared.`);

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