import { Bundle } from "../../../core/Bundle";
import { Config, ConfigState } from "../../../core/Config";
import { Container } from "../../../core/Container";
import { AmqpConnectionFactory } from "./AmqpConnectionFactory";
import { AmqpQueueConnectionFactory } from "./AmqpQueueConnectionFactory";
import { AmqpTopicConnectionFactory } from "./AmqpTopicConnectionFactory";
import { QueueConnectionFactory, TopicConnectionFactory } from "../abstract/index";

/** @internal */
import * as amqplib from "amqplib";

export class AmqpBundle extends Bundle {

    public name(): string {
        return "guppy.messaging.amqp";
    }

    public config(config: Config): void {
        config
            .section("guppy.messaging.amqp")
                .set("url", process.env["AMQP_URL"] || "amqp://localhost:5672")
            .end();
    }

    public services(container: Container, config: ConfigState): void {
        container
            .factory(AmqpConnectionFactory, () => new AmqpConnectionFactory(
                config.get("guppy.messaging.amqp.url"),
                amqplib
            ))
            .service(AmqpQueueConnectionFactory, [
                AmqpConnectionFactory
            ])
            .service(AmqpTopicConnectionFactory, [
                AmqpConnectionFactory
            ])
            .factory(QueueConnectionFactory, () => container.get(AmqpQueueConnectionFactory))
            .factory(TopicConnectionFactory, () => container.get(AmqpTopicConnectionFactory));
    }
}
