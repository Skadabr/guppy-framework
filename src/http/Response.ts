import { ResponseStatus } from "./ResponseStatus";
import { Headers } from "./Headers";

export class Response {

    public constructor(
        private _content: any,
        private _statusCode: number,
        private _headers: Headers
    ) {

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

    public static json(statusCode: number, content: any, headers?: Headers) {
        headers = headers || {};

        return new Response(
            content,
            statusCode,
            Object.assign({ "Content-Type": "application/json" }, headers)
        );
    }

    public static ok(content: any, headers?: Headers) {
        return Response.json(
            ResponseStatus.Ok,
            content,
            headers
        );
    }

    public static notFound(content: any, headers?: Headers) {
        return Response.json(
            ResponseStatus.NotFound,
            content,
            headers
        );
    }

    public static list(content: any, headers?: Headers) {
        return Response.json(
            ResponseStatus.Ok,
            content,
            Object.assign({ "Count": content.length }, headers)
        );
    }
}