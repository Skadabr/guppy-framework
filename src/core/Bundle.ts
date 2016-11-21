import { Container } from "./Container";
import { Config, ConfigState } from "./Config";

export abstract class Bundle {

    public abstract name(): string;

    public autoload(): string[] {
        return [];
    }

    public config(config: Config): void {

    }

    public developmentConfig(config: Config): void {

    }

    public productionConfig(config: Config): void {

    }

    public testingConfig(config: Config): void {

    }

    public services(container: Container, config: ConfigState): void {

    }

    public developmentServices(container: Container, config: ConfigState): void {

    }

    public productionServices(container: Container, config: ConfigState): void {

    }

    public testingServices(container: Container, config: ConfigState): void {

    }
}