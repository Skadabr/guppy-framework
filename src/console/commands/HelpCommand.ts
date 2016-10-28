import { Command }          from "../Command";
import { ConsoleInput }     from "../ConsoleInput";
import { ConsoleOutput }    from "../ConsoleOutput";
import { CommandRegistry }   from "../CommandRegistry";

export class HelpCommand implements Command {

    public constructor(
        private version: string,
        private commandRegistry: CommandRegistry
    ) {
    }

    public inputArguments(): Array<string> {
        return [];
    }

    public async execute(input: ConsoleInput, output: ConsoleOutput) {
        output
            .important(`Guppy Console - v${this.version}`)
            .blank()
            .text('Usage:')
            .message(`\tcommand [options] [arguments]`)
            .blank()
            .text('Available commands:');

        const commands = this.commandRegistry.all();

        let commandKey;
        for (commandKey in commands) {
            output.message(`\t${commandKey}`)
        }
    }
}