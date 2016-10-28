import assert = require("assert");

import { HelpCommand } from "../../../console/commands/HelpCommand";
import { ConsoleInput, ConsoleOutput, CommandRegistry } from "../../../console";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.commands.HelpCommand", () => {

    it("does not accept any arguments", () => {
        const version = "1.0.0";
        const commandRegistry = new CommandRegistry();

        const helpCommand = new HelpCommand(version, commandRegistry);

        assert.deepEqual(helpCommand.inputArguments(), []);
    });

    it("displays all available commands", () => {
        const version = "1.0.0";
        const commandRegistry = new CommandRegistry();

        let consoleOutputData = "";

        const consoleOutput = mock<ConsoleOutput>({
            
            text(message: string): ConsoleOutput {
                consoleOutputData += `<important>${message}</important>`;
                return consoleOutput;
            },

            message(message: string): ConsoleOutput {
                consoleOutputData += `<message>${message}</message>`;
                return consoleOutput;
            },

            important(message: string): ConsoleOutput {
                consoleOutputData += `<text>${message}</text>`;
                return consoleOutput;
            },

            blank(): ConsoleOutput {
                consoleOutputData += "\n";
                return consoleOutput;
            }
        });

        const helpCommand = new HelpCommand(version, commandRegistry);

        commandRegistry.register('help', Object);
        commandRegistry.register('greeting', Object);

        return helpCommand
            .execute(
                mock<ConsoleInput>(),
                consoleOutput
            )
            .then(() => {
                consoleOutputData = consoleOutputData.replace(/\s+/g, " ");

                assert.ok(consoleOutputData.indexOf("<text>Guppy Console - v1.0.0</text>") > -1);

                assert.ok(consoleOutputData.indexOf("<important>Usage:</important>") > -1);
                assert.ok(consoleOutputData.indexOf("<message> command [options] [arguments]</message>") > -1);
                
                assert.ok(consoleOutputData.indexOf("<important>Available commands:</important>") > -1);
                assert.ok(consoleOutputData.indexOf("<message> help</message>") > -1);
                assert.ok(consoleOutputData.indexOf("<message> greeting</message>") > -1);
            });
    });
});