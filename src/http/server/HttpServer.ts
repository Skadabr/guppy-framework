import * as http from "http";

import { HttpSession } from "./HttpSession";
import { Presenter } from "../../presenter/Presenter";
import { Response } from "../Response";
import { Router } from "./Router";
import { ErrorHandlerRegistry } from "./ErrorHandlerRegistry";
import { Logger } from "../../core";

export class HttpServer {

    private _server: http.Server;

    public constructor(
        private _router: Router,
        private _presenter: Presenter,
        private _errorHandlerRegistry: ErrorHandlerRegistry,
        private _logger: Logger
    ) {
    }

    private handleRequest(httpSession: HttpSession): Promise<void> {
        return Promise
                .resolve()
                .then(() => this._router.resolve(httpSession.method, httpSession.url))
                .then(resolvedRoute => resolvedRoute.handler(
                    httpSession.createRequest(resolvedRoute.routeParameters)
                ))
                .then(response => {
                    if (response == null) throw new Error("Action must return any Response.");
                    return response;
                })
                .catch(error => this._errorHandlerRegistry.handle(error))
                .then(response => httpSession.sendResponse(response, this._presenter));
    }

    public listen(port: number): Promise<void> {

        this._router.build();

        this._server = http.createServer((nativeRequest, nativeResponse) => {

            this._logger.debug("%s %s", nativeRequest.method, nativeRequest.url);

            let chunks: Buffer[] = [];

            nativeRequest
                .on('data', (chunk: Buffer) => chunks.push(chunk))
                .on('end', () => {
                    const nativeRequestBody: string = Buffer.concat(chunks).toString();
                    const httpSession = new HttpSession(nativeRequest, nativeResponse, nativeRequestBody);

                    this.handleRequest(httpSession)
                        .catch(error => {
                            this._logger.error("%s", error.stack);
                            httpSession.abort("Bad request.", 400)
                        });
                });
        });

        return new Promise<void>((resolve, reject) => {
            const onError = error => {
                this._server.removeListener('listening', onListening);
                reject(error);
            };

            const onListening = () => {
                this._server.removeListener('error', onError);
                resolve();
            };

            this._server.on('clientError', (err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'));
            this._server.once('error', onError);
            this._server.once('listening', onListening);
            this._server.listen(port);
        });
    }

    public terminate(): Promise<void> {
        return new Promise<void>(resolve => {
            if (!this._server) {
                resolve();
                return;
            }

            this._server.once('close', () => resolve());
            this._server.close();
        });
    }
}