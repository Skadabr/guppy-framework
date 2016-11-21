import { ResponseStatus } from "./ResponseStatus";
import { Headers } from "./Headers";

export type ResponseStreamWriter = (stream: ResponseStream) => void;

export interface ResponseStream {
    write(content: string | Buffer);
    end(content?: string | Buffer);
}

export class Response {

    private _content: any = null;
    private _statusCode: number = ResponseStatus.Ok;
    private _headers: Headers = {};

    public streamWriter: ResponseStreamWriter;

    public constructor(
        content?: any,
        statusCode?: number,
        headers?: Headers
    ) {
        if (content !== void 0) this.setContent(content);
        if (headers !== void 0) this.setHeaders(headers);
        if (statusCode !== void 0) this.setStatusCode(statusCode);
    }

    public content(): any {
        return this._content;
    }

    public setContent(content: any): Response {
        this._content = content;
        return this;
    }

    public setHeaders(headers: Headers) {
        this._headers = headers;
    }

    public setHeader(header: string, value: string | number): Response {
        this._headers[header] = value.toString();
        return this;
    }

    public headers(): Headers {
        return this._headers;
    }

    public statusCode(): number {
        return this._statusCode;
    }

    public setStatusCode(statusCode: number): Response {
        this._statusCode = statusCode;
        return this;
    }

    public stream(streamWriter: ResponseStreamWriter): Response {
        this.streamWriter = streamWriter;
        return this;
    }

    public static json(statusCode: number, content: any, headers?: Headers): Response {
        headers = headers || {};

        return new Response(
            content,
            statusCode,
            Object.assign({ "Content-Type": "application/json" }, headers)
        );
    }

    public static contentType(contentType: string): Response {
        return new Response().setHeader("Content-Type", contentType);
    }

    public static ok(content: any, headers?: Headers): Response {
        return Response.json(
            ResponseStatus.Ok,
            content,
            headers
        );
    }

    public static redirect(url: string, headers?: Headers): Response {
        return Response.json(
            ResponseStatus.Found,
            { location: url },
            Object.assign({ "Location": url }, headers)
        );
    }

    public static notFound(content: any, headers?: Headers): Response {
        return Response.json(
            ResponseStatus.NotFound,
            content,
            headers
        );
    }

    public static list(content: any, headers?: Headers): Response {
        return Response.json(
            ResponseStatus.Ok,
            content,
            Object.assign({ "Count": content.length }, headers)
        );
    }

    public static stream(streamWriter: ResponseStreamWriter, headers?: Headers, statusCode?: number): Response {
        return new Response(null, statusCode, headers).stream(streamWriter);
    }
}