import * as http from "http";

import { HandlerResolver } from "./HandlerResolver";
import { ActionInvoker } from "./ActionInvoker";
import { HttpSession } from "./HttpSession";
import {Presenter} from "../../presenter/Presenter";

export class HttpServer {

    private _server: http.Server;
    private _handlerResolver: HandlerResolver;
    private _actionInvoker: ActionInvoker;
    private _presenter: Presenter;

    public constructor(
        handlerResolver: HandlerResolver,
        actionInvoker: ActionInvoker,
        presenter: Presenter
    ) {
        this._handlerResolver = handlerResolver;
        this._actionInvoker = actionInvoker;
        this._presenter = presenter;
        this._server = http.createServer((nativeRequest, nativeResponse) => {

            let chunks: Buffer[] = [];

            nativeRequest
                .on('data', (chunk: Buffer) => chunks.push(chunk))
                .on('end', () => {
                    const nativeRequestBody: string = Buffer.concat(chunks).toString();
                    const httpSession = new HttpSession(nativeRequest, nativeResponse, nativeRequestBody);

                    this.handleRequest(httpSession)
                        .catch(error => {
                            console.error(error);
                            httpSession.abort("Bad request.", 400);
                        });
                });
        });

        this._server.on('clientError', (err, socket) => socket.end('HTTP/1.1 400 Bad Request\r\n\r\n'));
    }

    private async handleRequest(httpSession: HttpSession): Promise<void> {

        const handler = this._handlerResolver.resolve(httpSession.method, httpSession.url);

        httpSession.sendResponse(
            await this._actionInvoker.invoke(
                httpSession.createRequest(handler.routeArguments),
                handler.handler,
                handler.handlerArguments
            ),
            this._presenter
        );
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

            const onError = error => {
                this._server.removeListener('close', onClose);
                reject(error);
            };

            const onClose = () => {
                this._server.removeListener('error', onError);
                resolve();
            };

            this._server.once('error', onError);
            this._server.once('close', onClose);
            this._server.close();
        });
    }
}