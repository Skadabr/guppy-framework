import { Headers } from "./Headers";
import { IncomingMessage } from "http";

export type ParameterSet = { [key: string]: string };

export class Request {

    public constructor(
        private _incomingMessage: IncomingMessage,
        private _body: any,
        private _route: ParameterSet,
        private _query?: ParameterSet
    ) {
        this._query = this._query || {};
    }

    public method(): string {
        return this._incomingMessage.method;
    }

    public url(): string {
        return this._incomingMessage.url;
    }

    public get headers(): Headers {
        return this._incomingMessage.headers;
    }

    public header(name: string): string | null {
        return this._incomingMessage.headers[
                name.toLowerCase()
        ] || null;
    }

    public hasHeader(name: string): boolean {
        return this._incomingMessage.headers.hasOwnProperty(
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
        return this._incomingMessage.connection.remoteAddress;
    }
}