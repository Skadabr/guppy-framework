import { Response, ResponseStatus } from "..";

export interface ErrorHandler {
    handle(error: any): Response
}

export class ErrorHandlerRegistry {

    private errorHandlers: Map<Function, ErrorHandler> = new Map();

    public register(errorClass: Function, errorHandler: ErrorHandler) {
        this.errorHandlers.set(errorClass, errorHandler);
    }

    public handle(error: Error): Response {

        if (this.errorHandlers.has(error.constructor)) {
            return this.errorHandlers.get(error.constructor).handle(error);
        }

        return this.defaultHandler(error);
    }

    private defaultHandler(error: Error) {
        return Response.json(
            ResponseStatus.InternalServerError,
            {
                developerMessage: error.message,
                userMessage: "Internal Server Error"
            }
        );
    }
}