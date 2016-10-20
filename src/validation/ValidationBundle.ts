import { Bundle } from "../core/Bundle";
import { Config, ConfigState } from "../core/Config";
import { Container } from "../core/Container";
import { ValidationRequestReducer } from "./ValidationRequestReducer";

export class ValidationBundle extends Bundle {

    public name(): string {
        return "guppy.validation";
    }

    autoload(): string[] {
        return [];
    }

    config(config: Config): void {

    }

    services(container: Container, config: ConfigState): void {
        container.factory(
            ValidationRequestReducer, 
            () => new ValidationRequestReducer(),
            { "guppy.http.request_reducer": true }
        );
    }
}
