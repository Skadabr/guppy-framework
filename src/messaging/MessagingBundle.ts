import { Bundle, Container, Config, ConfigState } from "../core";
import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { PublisherFactory } from "./PublisherFactory";
import { CommandRegistry } from "../console/CommandRegistry";
import { MessagingServeCommand } from "./commands/MessagingServeCommand";
import { ObserverRegistry } from "./ObserverRegistry";
import { DefaultMessageHandlerFactory } from "./DefaultMessageHandlerFactory";
import { DefaultPublisherFactory } from "./DefaultPublisherFactory";
import { TopicConnectionFactory, QueueConnectionFactory } from "./platform/abstract/index";
import { LoggerFactory } from "../core/logger/LoggerFactory";

export class MessagingBundle extends Bundle {

    public name(): string {
        return "guppy.messaging";
    }

    public config(config: Config): void {
        config
            .section("guppy.messaging")
                .set("messageHandlerFactoryClass", DefaultMessageHandlerFactory)
                .set("publisherFactoryClass", DefaultPublisherFactory)
            .end();
    }

    public services(container: Container, config: ConfigState): void {
        container
            .factory(DefaultMessageHandlerFactory, () => new DefaultMessageHandlerFactory(
                container.get(TopicConnectionFactory),
                container.get(QueueConnectionFactory),
                container.get(LoggerFactory).createLogger("messaging")
            ))
            .factory(DefaultPublisherFactory, () => new DefaultPublisherFactory(
                container.get(TopicConnectionFactory),
                container.get(QueueConnectionFactory),
                container.get(LoggerFactory).createLogger("messaging")
            ))
            .factory(MessageHandlerFactory, () => container.get(
                config.get("guppy.messaging.messageHandlerFactoryClass") as Function
            ))
            .factory(PublisherFactory, () => container.get(
                config.get("guppy.messaging.publisherFactoryClass") as Function
            ))
            .service(MessagingServeCommand, [
                Container,
                ObserverRegistry,
                MessageHandlerFactory
            ])
            .extend(CommandRegistry, (commandRegistry: CommandRegistry) => {
                commandRegistry.register("messaging:serve", MessagingServeCommand);
            });
    }
}