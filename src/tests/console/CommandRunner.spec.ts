import assert = require("assert");

import { ConsoleWriter, CommandRunner, Command } from "../../console";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.CommandRunner", () => {

    it("throws an exception for non registered commands", (done) => {
        const availableCommands = new Map();
        const consoleWriter = mock<ConsoleWriter>({
            writeLine(message: string) {
                assert.equal(message, `Command "non-registered-command" is not defined.`);
                done();
            }
        });

        const commandRunner = new CommandRunner(availableCommands, consoleWriter);

        commandRunner.process(["script.js", "non-registered-command"]);
    });

    it("runs the default command when it omitted", (done) => {
        const availableCommands = new Map();
        const consoleWriter = mock<ConsoleWriter>({
            writeLine(message: string) {
                assert.equal(message, `Command "non-registered-command" is not defined.`);
            }
        });

        availableCommands.set("help", mock({
            instance: () => ({
                inputArguments: () => [],
                execute: () => done()
            })
        }));

        const commandRunner = new CommandRunner(availableCommands, consoleWriter);

        commandRunner.process(["script.js"]);
    });

});