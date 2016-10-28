import assert = require("assert");

import { ConfigState, DefaultConfig, Container } from "../../core";
import { ValidationBundle, ValidationRequestReducer } from "../../validation";
import { ReducerRegistry } from "../../http/server/ReducerRegistry";

describe("guppy.validation.ValidationBundle", () => {

    let validationBundle: ValidationBundle;

    before(() => {
        validationBundle = new ValidationBundle();
    });

    it("can be instantiated", () => {
        assert.ok(validationBundle instanceof ValidationBundle);
    });

    it("has a name", () => {
        assert.equal(validationBundle.name(), "guppy.validation");
    });

    it("does not have any autoload data", () => {
        assert.deepEqual(validationBundle.autoload(), []);
    });

    it("does not configure config", () => {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        validationBundle.config(config);
    });

    it("registers a ConsoleWriter", () => {
        const configState = new ConfigState();
        const container = new Container();
        const reducerRegistry = new ReducerRegistry();

        container.instance(ReducerRegistry, reducerRegistry);

        validationBundle.services(container, configState);

        return container
            .get(ValidationRequestReducer)
            .then((validationRequestReducer: ValidationRequestReducer) => {
                assert.ok(validationRequestReducer instanceof ValidationRequestReducer);

                return container.get(ReducerRegistry);
            })
            .then((reducerRegistry: ReducerRegistry) => {
                assert.ok(reducerRegistry instanceof ReducerRegistry);
            });
    });

});