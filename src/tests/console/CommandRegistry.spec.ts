import assert = require("assert");

import { CommandRegistry } from "../../console";

describe("guppy.console.CommandRegistry", () => {

    class TestCommand { }

    it("registers a command", () => {
        const commandRegistry: CommandRegistry = new CommandRegistry();

        commandRegistry.register("test", TestCommand);
    });

    it("returns all registered commands", () => {
        const commandRegistry: CommandRegistry = new CommandRegistry();

        commandRegistry.register("test", TestCommand);
        commandRegistry.register("alias-of-test", TestCommand);

        const commandSet = commandRegistry.all();

        assert.ok(commandSet.hasOwnProperty("test"));
        assert.ok(commandSet.hasOwnProperty("alias-of-test"));
        assert.equal(commandSet["test"], TestCommand);
        assert.equal(commandSet["alias-of-test"], TestCommand);
    });
});