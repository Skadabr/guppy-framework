import assert = require("assert");

import { ConfigState, DefaultConfigSection } from "../../core";

describe("guppy.core.ConfigState", () => {

    it("returns null for non existing value", () => {
        const configState = new ConfigState();

        assert.equal(configState.get("non-existing-value"), null);
    });

});