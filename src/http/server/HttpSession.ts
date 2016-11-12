import * as url from "url";

import { Request } from "../Request";
import { ResponseStatus } from "../ResponseStatus";
import { Headers } from "../Headers";
import { Response } from "../Response";
import { Presenter } from "../../presenter/Presenter";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";

export class HttpSession {

    public constructor(
        private _nativeRequest: IncomingMessage,
        private _nativeResponse: ServerResponse,
        private _nativeRequestBody: string
    ) {

    }

    public get method(): string {
        return this._nativeRequest.method;
    }

    public get url(): string {
        return this._nativeRequest.url;
    }

    public sendResponse(response: Response, presenter: Presenter) {

        const headers: Headers = response.headers();

        for (let headerName in headers) {
            this._nativeResponse.setHeader(headerName, headers[headerName]);
        }

        this._nativeResponse.statusCode = response.statusCode();

        if (response.streamWriter) {
            response.streamWriter(this._nativeResponse);
        } else {
            const content = response.content();

            if (response.statusCode() !== ResponseStatus.NoContent
                && this._nativeRequest.method !== 'HEAD'
                && content != null
            ) {
                const serializedContent: string = JSON.stringify(
                    presenter.present(content)
                );

                this._nativeResponse.setHeader('Content-Length', `${serializedContent.length}`);
                this._nativeResponse.write(serializedContent);
            }

            this._nativeResponse.end();
        }
    }

    public createRequest(routeParameters): Request {

        const urlParts = url.parse(this._nativeRequest.url, true);

        return new Request(
            this._nativeRequest,
            this.parseRequestBody(this._nativeRequestBody),
            routeParameters,
            urlParts.query
        );
    }

    private parseRequestBody(requestBody: string) {

        const contentType = this._nativeRequest.headers["content-type"];

        if (!contentType || this._nativeRequest.method === "GET" || this._nativeRequest.method === "HEAD") return {};

        switch (contentType) {
            case "application/json":
                try {
                    return JSON.parse(requestBody);
                } catch (e) {
                    this.abort("Invalid JSON in request.", 400);
                    
                    throw new Error(`Invalid JSON in request.`);
                }
        }

        this.abort("Unsupported Content-Type.", 400);

        throw new Error(`Unsupported Content-Type. Given: ${contentType}.`);
    }

    public abort(message: string, statusCode: number) {
        this._nativeResponse.statusCode = statusCode;
        this._nativeResponse.end(
            JSON.stringify({ error: message })
        );
    }
}