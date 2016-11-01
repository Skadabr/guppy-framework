import { ResponseStatus } from "./ResponseStatus";
import { Headers } from "./Headers";

export type ResponseStreamWriter = (stream: ResponseStream) => void;

export interface ResponseStream {
    write(content: string | Buffer);
    end(content?: string | Buffer);
}

export class Response {

    public constructor(
        private _content: any,
        private _statusCode: number,
        private _headers: Headers,
        public streamWriter?: ResponseStreamWriter
    ) {
        if (this._statusCode === void 0) this._statusCode = ResponseStatus.Ok;

    }

    public content(): any {
        return this._content;
    }

    public headers(): Headers {
        return this._headers;
    }

    public statusCode(): number {
        return this._statusCode;
    }

    public static json(statusCode: number, content: any, headers?: Headers): Response {
        headers = headers || {};

        return new Response(
            content,
            statusCode,
            Object.assign({ "Content-Type": "application/json" }, headers)
        );
    }

    public static ok(content: any, headers?: Headers): Response {
        return Response.json(
            ResponseStatus.Ok,
            content,
            headers
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
        return new Response(null, statusCode, headers, streamWriter);
    }
}