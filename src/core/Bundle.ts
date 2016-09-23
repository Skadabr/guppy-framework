import { Container } from "./Container";
import { Config, ConfigState } from "./Config";

export abstract class Bundle {
    public abstract name(): string;
    public abstract autoload(): string[];
    public abstract config(config: Config): void;
    public abstract services(container: Container, config: ConfigState): void;
}