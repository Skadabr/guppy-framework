import assert = require("assert");

import { ConsoleOutput, CommandRunner } from "../../console";
import { CommandRegistry } from "../../console/CommandRegistry";
import {Container} from "../../core/Container";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.CommandRunner", () => {

    it("throws an exception for non registered commands", (done) => {
        const container = new Container();
        const commandRegistry = new CommandRegistry();
        const consoleOutput = mock<ConsoleOutput>({
            text(message: string) {
                assert.equal(message, `Command "non-registered-command" is not defined.`);
                done();
            }
        });

        const commandRunner = new CommandRunner(container, commandRegistry, consoleOutput);

        commandRunner.process(["script.js", "non-registered-command"]);
    });
    
    it("runs the default command when it omitted", (done) => {
        const container = new Container();
        const commandRegistry = new CommandRegistry();
        const consoleOutput = mock<ConsoleOutput>({
            text(message: string) {
                assert.equal(message, `Command "non-registered-command" is not defined.`);
            }
        });

        class HelpCommand {
            inputArguments = () => [];
            execute = () => done();
        }

        commandRegistry.register("help", HelpCommand);
    
        const commandRunner = new CommandRunner(container, commandRegistry, consoleOutput);
    
        commandRunner.process(["script.js"]);
    });

});