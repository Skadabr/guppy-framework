import { Headers } from "./Headers";

export type ParameterSet = { [key: string]: string };

export class Request {

    public constructor(
        private _method: string,
        private _url: string,
        private _headers: Headers,
        private _body: any,
        private _route: ParameterSet,
        private _remoteAddress: string,
        private _query?: ParameterSet
    ) {
        this._query = this._query || {};
    }

    public method(): string {
        return this._method;
    }

    public url(): string {
        return this._url;
    }

    public get headers(): Headers {
        return this._headers;
    }

    public header(name: string): string | null {
        return this._headers[
                name.toLowerCase()
        ] || null;
    }

    public hasHeader(name: string): boolean {
        return this._headers.hasOwnProperty(
            name.toLowerCase()
        );
    }

    public get query(): ParameterSet {
        return this._query;
    }

    public get route(): ParameterSet {
        return this._route;
    }

    public get body(): {} {
        return this._body;
    }

    public get remoteAddress(): string {
        return this._remoteAddress;
    }
}