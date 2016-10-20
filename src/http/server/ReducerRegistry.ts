import { Request } from "../Request";
import { Response } from "../Response";
import { RequestContext } from "./RequestContext";

export interface Reducer<T> {
    modify(value: T): Promise<T>;
}

export interface RequestReducer {
    modify(value: Request, requestContext: RequestContext): Promise<Request>;
}

export class ReducerRegistry {

    private _requestReducers: RequestReducer[] = [];
    private _responseReducers: Reducer<Response>[] = [];

    public registerRequestReducer(reducer: RequestReducer): void {
        this._requestReducers.push(reducer);
    }

    public registerResponseReducer(reducer: Reducer<Response>): void {
        this._responseReducers.push(reducer);
    }

    public requestReducers(): RequestReducer[] {
        return this._requestReducers;
    }

    public responseReducers(): Reducer<Response>[] {
        return this._responseReducers;
    }
}