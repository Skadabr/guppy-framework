import { ServiceDefinition }        from "../core/ServiceDefinition";
import { Command }                  from "./Command";
import { ConsoleInput }             from "./ConsoleInput";
import { ConsoleInputProcessor }    from "./ConsoleInputProcessor";
import { ConsoleOutput }            from "./ConsoleOutput";

export const DEFAULT_COMMAND = "help";

export class CommandRunner {

    public constructor(
        private availableCommands: Map<string, ServiceDefinition>,
        private consoleOutput: ConsoleOutput
    ) {

    }

    public async process(argv: string[]) {
        await this.handleCommand(
            (argv.length > 1)
                ? argv.slice(1)
                : [DEFAULT_COMMAND]
        );
    }

    private async handleCommand(argv: Array<string>) {
        let inputCommand: string = argv[0];

        if (!this.availableCommands.has(inputCommand)) {
            this.consoleOutput.text(`Command "${inputCommand}" is not defined.`);
            return;
        }

        let consoleInputProcessor: ConsoleInputProcessor = new ConsoleInputProcessor();
        let command: Command = await this.availableCommands.get(inputCommand).instance<Command>();
        let consoleInput: ConsoleInput = consoleInputProcessor.process(argv.slice(1), command);

        command.execute(consoleInput, this.consoleOutput);
    }
}