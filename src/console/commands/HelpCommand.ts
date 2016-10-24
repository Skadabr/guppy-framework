import { Command }          from "../Command";
import { ConsoleInput }     from "../ConsoleInput";
import { ConsoleOutput }    from "../ConsoleOutput";
import { ServiceDefinition } from "../../core/ServiceDefinition";

export class HelpCommand implements Command {

    public constructor(
        private version: string,
        private availableCommands: Map<string, ServiceDefinition>
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

        this.availableCommands.forEach((serviceDefinition: ServiceDefinition, commandKey: string) => {
            output.message(`\t${commandKey}`)
        });
    }
}