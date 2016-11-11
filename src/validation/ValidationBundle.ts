import { Bundle } from "../core/Bundle";
import { ConfigState } from "../core/Config";
import { Container } from "../core/Container";
import { MiddlewareRegistry } from "../http/server/MiddlewareRegistry";
import { ValidationMiddleware } from "./ValidationMiddleware";

export class ValidationBundle extends Bundle {

    public name(): string {
        return "guppy.validation";
    }

    public services(container: Container, config: ConfigState): void {
        container
            .extend(MiddlewareRegistry, (middlewareRegistry: MiddlewareRegistry) => {
                middlewareRegistry.register(
                    container.get(ValidationMiddleware)
                );
            });
    }
}
