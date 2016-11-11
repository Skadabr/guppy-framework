import { Bundle } from "../core/Bundle";
import { Container } from "../core/Container";
import { Config, ConfigState } from "../core/Config";
import { VERSION } from "..";

import { CommandRegistry, ConsoleWriter, ConsoleOutput, DefaultConsoleWriter, DefaultConsoleOutput } from ".";
import { HelpCommand } from "./commands/HelpCommand";

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
        container
            .factory(HelpCommand, () => new HelpCommand(
                VERSION,
                container.get(CommandRegistry)
            ))
            .extend(CommandRegistry, (commandRegistry: CommandRegistry) => {
                commandRegistry.register("help", HelpCommand);
            })
            .factory(ConsoleWriter, () => new DefaultConsoleWriter(process.stdout))
            .factory(ConsoleOutput, () => new DefaultConsoleOutput(
                container.get(ConsoleWriter)
            ));
    }
}