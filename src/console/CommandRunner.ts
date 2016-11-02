import { Command }                  from "./Command";
import { ConsoleInputProcessor }    from "./ConsoleInputProcessor";
import { ConsoleOutput }            from "./ConsoleOutput";
import { CommandRegistry }          from "./CommandRegistry";
import { Container }                from "../core/Container";

export const DEFAULT_COMMAND = "help";

export class CommandRunner {

    public constructor(
        private container: Container,
        private commandRegistry: CommandRegistry,
        private consoleOutput: ConsoleOutput
    ) {
    }

    public process(argv: string[]) {
        return this.handleCommand(argv.length > 1 ? argv.slice(1) : [DEFAULT_COMMAND]);
    }

    private handleCommand(argv: Array<string>) {

        let inputCommand: string = argv[0];

        const availableCommands = this.commandRegistry.all();

        if (!availableCommands.hasOwnProperty(inputCommand)) {
            this.consoleOutput.text(`Command "${inputCommand}" is not defined.`);
            return;
        }

        const command: Command = this.container.get<Command>(availableCommands[inputCommand]);

        return command.execute(
            new ConsoleInputProcessor().process(argv.slice(1), command),
            this.consoleOutput
        );
    }
}