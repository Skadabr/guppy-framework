import assert = require("assert");

import { ConfigState, DefaultConfig, Container } from "../../core";
import { ValidationBundle, ValidationMiddleware } from "../../validation";
import { MiddlewareRegistry } from "../../http/server";

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
        const middlewareRegistry = new MiddlewareRegistry();

        container.instance(MiddlewareRegistry, middlewareRegistry);

        validationBundle.services(container, configState);

        return container
            .get(ValidationMiddleware)
            .then((validationMiddleware: ValidationMiddleware) => {
                assert.ok(validationMiddleware instanceof ValidationMiddleware);

                return container.get(MiddlewareRegistry);
            })
            .then((middlewareRegistry: MiddlewareRegistry) => {
                assert.ok(middlewareRegistry instanceof MiddlewareRegistry);
            });
    });

});