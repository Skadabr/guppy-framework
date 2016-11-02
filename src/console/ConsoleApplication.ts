import { ConsoleOutput, CommandRunner, ConsoleBundle } from ".";
import { Application, Container, Bundle } from "../core";
import { CommandRegistry } from "./CommandRegistry";

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
            .then((container: Container) => {

                new CommandRunner(
                    container,
                    container.get(CommandRegistry),
                    container.get(ConsoleOutput)
                ).process(argv);

                return container;
            });
    }
}