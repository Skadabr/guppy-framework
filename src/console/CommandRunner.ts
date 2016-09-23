import { ServiceDefinition }        from "../core/ServiceDefinition";
import { Command }                  from "./Command";
import { ConsoleInput }             from "./ConsoleInput";
import { ConsoleInputProcessor }    from "./ConsoleInputProcessor";
import { ConsoleWriter }            from "./ConsoleWriter";
import { DefaultConsoleOutput }     from "./DefaultConsoleOutput";

export const DEFAULT_COMMAND = 'help';

export class CommandRunner {

    public constructor(
        private availableCommands: Map<string, ServiceDefinition>,
        private consoleWriter: ConsoleWriter
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

        if (this.availableCommands.has(inputCommand)) {
            let consoleInputProcessor: ConsoleInputProcessor = new ConsoleInputProcessor();
            let command: Command = await this.availableCommands.get(inputCommand).instance<Command>();
            let consoleInput: ConsoleInput = consoleInputProcessor.process(
                argv.slice(1),
                command
            );

            command.execute(
                consoleInput,
                new DefaultConsoleOutput(this.consoleWriter)
            );
        } else {
            this.consoleWriter.writeLine(`Command "${inputCommand}" is not defined.`);
        }
    }
}