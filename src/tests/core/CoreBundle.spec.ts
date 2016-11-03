import { CoreBundle, DefaultConfig, ConfigState, Container } from "../../core";
import { Log4jsLoggerFactory, Logger } from "../../core/logger";

import * as assert from "assert";

describe("guppy.core.CoreBundle", () => {

    it("has a name", () => {
        const coreBundle = new CoreBundle();
        assert.equal(coreBundle.name(), "guppy.core");
    });

    it("does not have autoload data", () => {
        const coreBundle = new CoreBundle();
        assert.deepEqual(coreBundle.autoload(), []);
    });

    it("has own configuration", () => {
        const coreBundle = new CoreBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        coreBundle.config(config);

        assert.equal(configState.get("guppy.core.logger.level"), "DEBUG");
        assert.equal(configState.get("guppy.core.logger.factoryClass"), Log4jsLoggerFactory);
        assert.deepEqual(
            configState.get("guppy.core.logger.appenders"),
            [
                { type: "console" },
                { type: "file", filename: "logs/guppy.log" },
            ]
        );
    });

    it("registers own services", () => {

        const coreBundle = new CoreBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);
        const container = new Container();

        coreBundle.config(config);

        configState.set("guppy.core.logger.appenders", [
            { type: "console" }
        ]);

        coreBundle.services(container, configState);

        assert.ok(container.get(Logger) instanceof Logger);
    });
});
