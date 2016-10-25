import { ReducerRegistry, Reducer, RequestReducer } from "../../../http/server";
import { Response } from "../../../http";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.ReducerRegistry", () => {

    it("returns registered request reducers", () => {

        const reducerRegistry = new ReducerRegistry();

        const firstReducer = mock<RequestReducer>();
        const secondReducer = mock<RequestReducer>();

        reducerRegistry.registerRequestReducer(firstReducer);
        reducerRegistry.registerRequestReducer(secondReducer);

        const requestReducers = reducerRegistry.requestReducers();

        assert.equal(requestReducers[0], firstReducer);
        assert.equal(requestReducers[1], secondReducer);
    });

    it("returns registered response reducers", () => {

        const reducerRegistry = new ReducerRegistry();

        const firstReducer = mock<Reducer<Response>>();
        const secondReducer = mock<Reducer<Response>>();

        reducerRegistry.registerResponseReducer(firstReducer);
        reducerRegistry.registerResponseReducer(secondReducer);

        const requestReducers = reducerRegistry.responseReducers();

        assert.equal(requestReducers[0], firstReducer);
        assert.equal(requestReducers[1], secondReducer);
    });
});