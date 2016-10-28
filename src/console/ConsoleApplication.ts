import { HelpCommand } from "./commands/HelpCommand";
import { ConsoleOutput, CommandRunner, ConsoleBundle } from ".";
import { Application, Container, Bundle, ServiceDefinition } from "../core";
import { VERSION } from "..";
import { CommandRegistry } from "./CommandRegistry";

export const COMMAND_TAG = "guppy.console.command";

export class ConsoleApplication {

    public constructor(
        private _bundles: Bundle[]
    ) {
    }

    public async run(argv: string[]): Promise<Container> {

        let defaultApplication = new Application(
            [ new ConsoleBundle() ].concat(this._bundles)
        );

        return defaultApplication
            .run(argv)
            .then(async (container: Container) => {

                const commandRunner = new CommandRunner(
                    container,
                    await container.get(CommandRegistry),
                    await container.get(ConsoleOutput)
                );

                await commandRunner.process(argv);

                return container;
            });
    }
}