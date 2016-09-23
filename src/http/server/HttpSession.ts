import * as url from "url";

import { Request } from "../Request";
import { ResponseStatus } from "../ResponseStatus";
import { Headers } from "../Headers";
import { Response } from "../Response";
import { Presenter } from "../../presenter/Presenter";

export class HttpSession {

    public constructor(
        private _nativeRequest,
        private _nativeResponse,
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

        const content: any = presenter.present(
            response.content()
        );

        const serializedContent: string = JSON.stringify(content);

        const headers: Headers = response.headers();
        for (let headerName in headers) {
            this._nativeResponse.setHeader(headerName, headers[headerName]);
        }

        this._nativeResponse.statusCode = response.statusCode();
        this._nativeResponse.setHeader('Content-Length', `${serializedContent.length}`);

        if (content && response.statusCode() !== ResponseStatus.NoContent && this._nativeRequest.method !== 'HEAD') {
            this._nativeResponse.write(serializedContent);
        }

        this._nativeResponse.end();
    }

    public createRequest(routeParameters): Request {

        const urlParts = url.parse(this._nativeRequest.url, true);

        return new Request(
            this._nativeRequest.method,
            this._nativeRequest.url,
            this._nativeRequest.headers,
            this.parseRequestBody(this._nativeRequestBody),
            routeParameters,
            this._nativeRequest.connection.remoteAddress,
            urlParts.query
        );
    }

    private parseRequestBody(requestBody: string) {

        const contentType = this._nativeRequest.headers["content-type"];

        if ( ! contentType) return {};

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

        throw new Error(`Unsupported Content-Type. Given: ${contentType}`);
    }

    public abort(message: string, statusCode: number) {
        this._nativeResponse.statusCode = statusCode;
        this._nativeResponse.end(
            JSON.stringify({ error: message })
        );
    }
}