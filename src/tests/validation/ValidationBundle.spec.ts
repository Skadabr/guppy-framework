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

        container.instance(MiddlewareRegistry, new MiddlewareRegistry());

        validationBundle.services(container, configState);

        const validationMiddleware: ValidationMiddleware = container.get(ValidationMiddleware);
        const middlewareRegistry: MiddlewareRegistry = container.get(MiddlewareRegistry);

        assert.ok(validationMiddleware instanceof ValidationMiddleware);
        assert.ok(middlewareRegistry instanceof MiddlewareRegistry);
    });

});