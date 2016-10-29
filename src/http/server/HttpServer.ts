import * as http from "http";

import { HttpSession } from "./HttpSession";
import { Presenter } from "../../presenter/Presenter";
import { Response } from "../Response";
import { ResponseStatus } from "../ResponseStatus";
import { Router } from "./Router";

export class HttpServer {

    private _server: http.Server;

    public constructor(
        private _router: Router,
        private _presenter: Presenter
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

        try {
            const resolverRoute = this._router.resolve(httpSession.method, httpSession.url);

            return resolverRoute
                .handler(httpSession.createRequest(resolverRoute.routeParameters))
                .catch(error => this.presentError(error))
                .then((response:Response) => httpSession.sendResponse(response, this._presenter));
        } catch (error) {
            return Promise.reject(error);
        }
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

    private presentError(error: Error): Response {
        return Response.json(ResponseStatus.InternalServerError, {
            error: error.name,
            errorMessage: error.message
        });
    }
}