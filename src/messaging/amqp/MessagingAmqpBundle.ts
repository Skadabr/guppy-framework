/// <reference path="./amqplib.d.ts" />

import { Bundle, Config, ConfigState, Container, LoggerFactory } from "../../core";
import { AmqpPublisherFactory } from "./AmqpPublisherFactory";
import { AmqpMessageHandlerFactory } from "./AmqpMessageHandlerFactory";
import { AmqpConnection } from "./AmqpConnection";

export class MessagingAmqpBundle extends Bundle {

    public name():string {
        return "guppy.messaging.amqp";
    }

    public autoload(): string[] {
        return [];
    }

    public config(config: Config): void {

        config
            .section("guppy.messaging")
                .set("messageHandlerFactoryClass", AmqpMessageHandlerFactory)
                .set("publisherFactoryClass", AmqpPublisherFactory)
            .end()
            .section("guppy.messaging.amqp")
                .set("url", process.env["AMQP_URL"] || "amqp://localhost:5672")
            .end();
    }

    public services(container: Container, config: ConfigState): void {

        container
            .factory(AmqpConnection, () => new AmqpConnection(
                container.get(LoggerFactory).createLogger("messaging"),
                config.get("guppy.messaging.amqp.url"))
            )
            .factory(AmqpPublisherFactory, () => container.get(AmqpConnection).createPublisherFactory())
            .factory(AmqpMessageHandlerFactory, () => container.get(AmqpConnection).createMessageHandlerFactory());
    }
}