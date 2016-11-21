import { Response, ResponseStatus } from "..";
import { Logger } from "../../core/logger/Logger";

export interface ErrorHandler {
    handle(error: any): Response
}

export class ErrorHandlerRegistry {

    private errorHandlers: Map<Function, ErrorHandler> = new Map();
    private logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public register(errorClass: Function, errorHandler: ErrorHandler) {
        this.errorHandlers.set(errorClass, errorHandler);
    }

    public handle(error: Error): Response {

        if (this.errorHandlers.has(error.constructor)) {
            return this.errorHandlers.get(error.constructor).handle(error);
        }

        return this.defaultHandler(error);
    }

    /**
     * @internal
     *
     */
    private defaultHandler(error: Error) {

        const message = error.message;
        const stacktrace = error.stack.substring(
            error.stack.indexOf("\n")
        );

        let messagePrefix: string = "";
        let isDebugEnabled: boolean = true;

        let content = {
            message: "Internal Server Error"
        };

        if (isDebugEnabled) {
            content["debugMessage"] = message;
            messagePrefix = error.constructor.name + ": ";
        }

        this.logger.error(messagePrefix + message, stacktrace);

        return Response.json(ResponseStatus.InternalServerError, content);
    }
}