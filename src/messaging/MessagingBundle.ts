import { Bundle, Container, Config, ConfigState } from "../core";
import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { PublisherFactory } from "./PublisherFactory";
import { CommandRegistry } from "../console/CommandRegistry";
import { MessagingServeCommand } from "./commands/MessagingServeCommand";
import { ObserverRegistry } from "./ObserverRegistry";
import { DefaultMessageHandlerFactory } from "./DefaultMessageHandlerFactory";
import { DefaultPublisherFactory } from "./DefaultPublisherFactory";
import { TopicConnectionFactory, QueueConnectionFactory } from "./platform/abstract/index";
import { Logger } from "../core/logger/Logger";
import { AmqpQueueConnectionFactory } from "./platform/amqp/AmqpQueueConnectionFactory";
import { AmqpConnectionFactory } from "./platform/amqp/AmqpConnectionFactory";
import { AmqpTopicConnectionFactory } from "./platform/amqp/AmqpTopicConnectionFactory";

import * as amqplib from "amqplib";
import {LoggerFactory} from "../core/logger/LoggerFactory";

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
                .set("publisherFactoryClass", DefaultPublisherFactory)
            .end();
    }

    public services(container: Container, config: ConfigState): void {

        container
            .factory(AmqpConnectionFactory, () => new AmqpConnectionFactory(
                config.get("guppy.messaging.amqp.url"),
                amqplib
            ))
            .factory(AmqpQueueConnectionFactory, () => new AmqpQueueConnectionFactory(
                container.get(AmqpConnectionFactory)
            ))
            .factory(AmqpTopicConnectionFactory, () => new AmqpTopicConnectionFactory(
                container.get(AmqpConnectionFactory)
            ));

        container
            .factory(QueueConnectionFactory, () => container.get(AmqpQueueConnectionFactory))
            .factory(TopicConnectionFactory, () => container.get(AmqpTopicConnectionFactory));

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