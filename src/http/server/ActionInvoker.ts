import { Request } from "../Request";
import { RequestHandlerFunction } from "./HandlerResolver";
import { Response } from "../Response";

export class ActionInvoker {

    private _argumentFactories: Map<Function, (Request) => any> = new Map();

    public constructor() {
        this._argumentFactories.set(Request, request => request);
    }

    public async invoke(request: Request, handler: RequestHandlerFunction, handlerArgumentClasses: Function[]): Promise<Response> {
        try {
            return await handler(...this.prepareArguments(request, handlerArgumentClasses));
        } catch (error) {
            console.error(error.stack);
            return Response.json(500, { errorMessage: "Internal Server Error" });
        }
    }

    private prepareArguments(request: Request, handlerArgumentClasses: Function[]) {

        const argumentValues = [];

        for (const argumentClass of handlerArgumentClasses) {
            if (! this._argumentFactories.has(argumentClass)) {
                throw new Error(`Class "${argumentClass.name}" cannot be resolved as argument.`);
            }

            argumentValues.push(this._argumentFactories.get(argumentClass)(request));
        }

        return argumentValues;
    }
}