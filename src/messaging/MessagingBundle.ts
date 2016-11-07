import { Bundle, Container, Config, ConfigState } from "../core";
import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { PublisherFactory } from "./PublisherFactory";
import { StubPublisherFactory } from "./StubPublisherFactory";
import { CommandRegistry } from "../console/CommandRegistry";
import { MessagingServeCommand } from "./commands/MessagingServeCommand";
import { ObserverRegistry } from "./ObserverRegistry";
import { DefaultMessageHandlerFactory } from "./DefaultMessageHandlerFactory";

export class MessagingBundle extends Bundle {

    public name(): string {
        return "guppy.messaging";
    }

    public autoload(): string[] {
        return [];
    }

    public config(config: Config): void {

        config
            .section("guppy.messaging")
                .set("messageHandlerFactoryClass", DefaultMessageHandlerFactory)
                .set("publisherFactoryClass", StubPublisherFactory)
            .end();
    }

    public services(container: Container, config: ConfigState): void {

        container
            .factory(MessageHandlerFactory, () => container.get(
                config.get("guppy.messaging.messageHandlerFactoryClass") as Function
            ))
            .factory(PublisherFactory, () => container.get(
                config.get("guppy.messaging.publisherFactoryClass") as Function
            ))
            .factory(ObserverRegistry, () => new ObserverRegistry())
            .factory(MessagingServeCommand, () => new MessagingServeCommand(
                container,
                container.get(ObserverRegistry),
                container.get(MessageHandlerFactory)
            ))
            .extend(CommandRegistry, (commandRegistry: CommandRegistry) => {
                commandRegistry.register("messaging:serve", MessagingServeCommand);
            });
    }
}