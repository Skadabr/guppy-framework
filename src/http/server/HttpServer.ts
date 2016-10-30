import * as http from "http";

import { HttpSession } from "./HttpSession";
import { Presenter } from "../../presenter/Presenter";
import { Response } from "../Response";
import { ResponseStatus } from "../ResponseStatus";
import { Router } from "./Router";
import {ErrorHandlerRegistry} from "./ErrorHandlerRegistry";

export class HttpServer {

    private _server: http.Server;

    public constructor(
        private _router: Router,
        private _presenter: Presenter,
        private _errorHandlerRegistry: ErrorHandlerRegistry
    ) {
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

    private handleRequest(httpSession: HttpSession): Promise<void> {
        return Promise
                .resolve()
                .then(() => this._router.resolve(httpSession.method, httpSession.url))
                .then(resolvedRoute => resolvedRoute.handler(
                    httpSession.createRequest(resolvedRoute.routeParameters)
                ))
                .catch(error => this._errorHandlerRegistry.handle(error))
                .then((response:Response) => httpSession.sendResponse(response, this._presenter));
    }

    public listen(port: number): Promise<void> {

        return this._router
            .build()
            .then(() => new Promise<void>((resolve, reject) => {
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
            }));
    }

    public terminate(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._server.once('close', () => resolve());
            this._server.close();
        });
    }
}