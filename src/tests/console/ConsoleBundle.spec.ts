import assert = require("assert");

import { ConfigState, DefaultConfig, Container } from "../../core";
import { ConsoleBundle, ConsoleWriter } from "../../console";

describe("guppy.console.ConsoleBundle", () => {

    let consoleBundle: ConsoleBundle;

    before(() => {
        consoleBundle = new ConsoleBundle();
    })

    it("can be instantiated", () => {
        assert.ok(consoleBundle instanceof ConsoleBundle);
    });

    it("has a name", () => {
        assert.equal(consoleBundle.name(), "guppy.console");
    });

    it("does not have any autoload data", () => {
        assert.deepEqual(consoleBundle.autoload(), []);
    });

    it("does not configure config", () => {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        consoleBundle.config(config);
    });

    it("registers a ConsoleWriter", () => {
        const configState = new ConfigState();
        const container = new Container();

        consoleBundle.services(container, configState);

        assert.ok(container.get(ConsoleWriter) instanceof ConsoleWriter);
    });

});