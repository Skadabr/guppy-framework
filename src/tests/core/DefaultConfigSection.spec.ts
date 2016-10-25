import assert = require("assert");

import { ConfigState, DefaultConfigSection } from "../../core";

describe("guppy.core.DefaultConfigSection", () => {

    it("sets a value for key", () => {
        const configState = new ConfigState();
        const configSection = new DefaultConfigSection(configState, "user", null);

        configSection.set("id", 10);

        assert.equal(configState.get("user.id"), 10);
    });

    it("sets a value for environment", () => {
        const configState = new ConfigState();
        const configSection = new DefaultConfigSection(configState, "app", null);

        delete process.env.APP_PORT;
        configSection.setFromEnvironment("port", "APP_PORT", 8080);

        assert.equal(configState.get("app.port"), 8080);
    });

});