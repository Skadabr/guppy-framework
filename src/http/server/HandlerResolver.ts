import { Request } from "../Request";
import { Response } from "../Response";

export type RequestHandlerFunction = (...args: any[]) => Promise<Response>;

export interface RequestHandler {
    routeArguments: { [key: string]: string };
    handler: RequestHandlerFunction;
    handlerArguments: Function[];
}

export abstract class HandlerResolver {
    public abstract registerHandler(method: string, url: string, handler: RequestHandlerFunction, handlerArguments: Function[]): void;
    public abstract resolve(method: string, url: string): RequestHandler;
}