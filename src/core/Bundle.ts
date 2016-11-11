import { Container } from "./Container";
import { Config, ConfigState } from "./Config";

export abstract class Bundle {

    public abstract name(): string;

    public autoload(): string[] {
        return [];
    }

    public config(config: Config): void {

    }

    public services(container: Container, config: ConfigState): void {

    }
}