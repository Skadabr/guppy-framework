import { Bundle } from "../core/Bundle";
import { Config, ConfigState } from "../core/Config";
import { Container } from "../core/Container";
import { MiddlewareRegistry } from "../http/server/MiddlewareRegistry";
import { ValidationMiddleware } from "./ValidationMiddleware";

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
        container
            .factory(
                ValidationMiddleware,
                () => new ValidationMiddleware()
            )
            .extend(
                MiddlewareRegistry,
                (middlewareRegistry: MiddlewareRegistry) => middlewareRegistry.register(
                    container.get(ValidationMiddleware)
                )
            );
    }
}
