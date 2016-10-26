import { Bundle } from "../core/Bundle";
import { Container } from "../core/Container";
import { Config, ConfigState } from "../core/Config";

import { ConsoleWriter, ConsoleOutput, DefaultConsoleWriter, DefaultConsoleOutput } from ".";

export class ConsoleBundle implements Bundle {

    name(): string {
        return "guppy.console";
    }

    autoload(): string[] {
        return [];
    }

    config(config: Config) {
    }

    services(container: Container, config: ConfigState): void {
        container.factory(ConsoleWriter, async () => new DefaultConsoleWriter(process.stdout));
        container.factory(ConsoleOutput, async () => new DefaultConsoleOutput(
            await container.get(ConsoleWriter)
        ));
    }
}