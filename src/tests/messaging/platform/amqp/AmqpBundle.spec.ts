import { Container, DefaultConfig, ConfigState } from "../../../../core";
import { QueueConnectionFactory, TopicConnectionFactory } from "../../../../messaging/platform/abstract";
import { AmqpBundle, AmqpQueueConnectionFactory, AmqpTopicConnectionFactory } from "../../../../messaging/platform/amqp";
import { AmqpConnectionFactory } from "../../../../messaging/platform/amqp/AmqpConnectionFactory";
import { assert } from "chai";

describe("guppy.messaging.platform.amqp.AmqpBundle", () => {

    it("has own name", () => {

        const subject = new AmqpBundle();

        assert.equal(
            subject.name(),
            "guppy.messaging.amqp"
        );
    });

    it("uses default address of amqp server", () => {
        const subject = new AmqpBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        subject.config(config);

        assert.equal(
            configState.get("guppy.messaging.amqp.url"),
            "amqp://localhost:5672"
        );
    });

    it("takes an address of amqp server from environment", () => {
        const subject = new AmqpBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        process.env["AMQP_URL"] = "amqp://amqp.company.internal:5672";

        subject.config(config);

        assert.equal(
            configState.get("guppy.messaging.amqp.url"),
            "amqp://amqp.company.internal:5672"
        );
    });

    it("registers amqp services", () => {
        const subject = new AmqpBundle();
        const configState = new ConfigState();
        const container = new Container();

        configState.set("guppy.messaging.amqp.url", "amqp://amqp.company.internal:5672");

        subject.services(container, configState);

        assert.instanceOf(container.get(AmqpConnectionFactory), AmqpConnectionFactory);
        assert.instanceOf(container.get(QueueConnectionFactory), AmqpQueueConnectionFactory);
        assert.instanceOf(container.get(TopicConnectionFactory), AmqpTopicConnectionFactory);
    });
});
