import * as http from "http";

import { HandlerResolver } from "./HandlerResolver";
import { ActionInvoker } from "./ActionInvoker";
import { HttpSession } from "./HttpSession";
import { Presenter } from "../../presenter/Presenter";
import { ReducerRegistry } from "./ReducerRegistry";
import { Response } from "../Response";
import { ResponseStatus } from "../ResponseStatus";
import {RequestContext} from "./RequestContext";
import {ValidationError} from "../../validation/ValidationError";

export class HttpServer {

    private _server: http.Server;
    private _handlerResolver: HandlerResolver;
    private _actionInvoker: ActionInvoker;
    private _presenter: Presenter;
    private _reducerRegistry: ReducerRegistry;

    public constructor(
        handlerResolver: HandlerResolver,
        actionInvoker: ActionInvoker,
        presenter: Presenter,
        reducerRegistry: ReducerRegistry
    ) {
        this._handlerResolver = handlerResolver;
        this._actionInvoker = actionInvoker;
        this._presenter = presenter;
        this._reducerRegistry = reducerRegistry;
        this._server = http.createServer((nativeRequest, nativeResponse) => {

            let chunks: Buffer[] = [];

            nativeRequest
                .on('data', (chunk: Buffer) => chunks.push(chunk))
                .on('end', () => {
                    const nativeRequestBody: string = Buffer.concat(chunks).toString();
                    const httpSession = new HttpSession(nativeRequest, nativeResponse, nativeRequestBody);

                    this.handleRequest(httpSession)
                        .catch(() => httpSession.abort("Bad request.", 400));
                });
        });

        this._server.on('clientError', (err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'));
    }

    private async handleRequest(httpSession: HttpSession): Promise<void> {

        let response: Response;

        try {
            const handler = this._handlerResolver.resolve(httpSession.method, httpSession.url);

            const requestContext = new RequestContext(handler.controller.constructor, handler.methodName);
            
            let request = httpSession.createRequest(handler.routeArguments);

            for (const requestReducer of this._reducerRegistry.requestReducers()) {
                request = await requestReducer.modify(request, requestContext);
            }

            response = await this._actionInvoker.invoke(
                request,
                handler.controller[handler.methodName].bind(handler.controller),
                handler.handlerArguments
            );

            for (const responseReducer of this._reducerRegistry.responseReducers()) {
                response = await responseReducer.modify(response);
            }
        } catch (error) {
            response = this.presentError(error);
        }
        
        httpSession.sendResponse(response, this._presenter);
    }

    public listen(port: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            const onError = error => {
                this._server.removeListener('listening', onListening);
                reject(error);
            };

            const onListening = () => {
                this._server.removeListener('error', onError);
                resolve();
            };

            this._server.once('error', onError);
            this._server.once('listening', onListening);
            this._server.listen(port);
        });
    }

    public terminate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._server.once('close', () => resolve());
            this._server.close();
        });
    }

    private presentError(error: Error): Response {

        const children = [];

        if (error.name == "ValidationError") {
            for (const violation of (<ValidationError> error).violations) {
                children.push(violation.message);
            }
        }

        return Response.json(
            ResponseStatus.InternalServerError,
            {
                error: error.name,
                errorMessage: error.message,
                children: children
            }
        );
    }
}