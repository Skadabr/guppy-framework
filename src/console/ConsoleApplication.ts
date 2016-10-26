import { HelpCommand } from "./commands/HelpCommand";
import { ConsoleOutput } from ".";
import { CommandRunner } from "./CommandRunner";
import { Application } from "../core/Application";
import { Container } from "../core/Container";
import { Bundle } from "../core/Bundle";
import { ServiceDefinition } from "../core/ServiceDefinition";
import { ConsoleBundle } from "./ConsoleBundle";

export const FRAMEWORK_VERSION = "1.0.3";
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
                    ConsoleApplication.availableCommands(container),
                    await container.get(ConsoleOutput)
                );

                await commandRunner.process(argv);

                return container;
            });
    }

    private static availableCommands(container: Container): Map<string, ServiceDefinition> {
        let result: Map<string, ServiceDefinition> = new Map();
        let commandDefinitions: ServiceDefinition[] = container.byTag(COMMAND_TAG);

        commandDefinitions.push(
            new ServiceDefinition(
                () => new HelpCommand(FRAMEWORK_VERSION, result),
                { "guppy.console.command": "help" }
            )
        );

        for (let commandDefinition of commandDefinitions) {
            result.set(
                <string> commandDefinition.tags()[COMMAND_TAG],
                commandDefinition
            );
        }

        return result;
    }
}