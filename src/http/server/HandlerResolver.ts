import { Request } from "../Request";
import { Response } from "../Response";

export interface RequestHandler {
    routeArguments: { [key: string]: string };
    controller: Object;
    methodName: string;
    handlerArguments: Function[];
}

export abstract class HandlerResolver {

    public abstract registerHandler(
        method: string,
        url: string,
        controller: Object,
        methodName: string,
        handlerArguments: Function[]
    ): void;
    
    public abstract resolve(
        method: string,
        url: string
    ): RequestHandler;
}