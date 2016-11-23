import { Container, DefaultConfig, ConfigState } from "../../core";
import { MessagingBundle } from "../../messaging";
import { assert } from "chai";
import {DefaultMessageHandlerFactory} from "../../messaging/DefaultMessageHandlerFactory";
import {DefaultPublisherFactory} from "../../messaging/DefaultPublisherFactory";
import {ObserverRegistry} from "../../messaging/ObserverRegistry";
import {MessageHandlerFactory} from "../../messaging/MessageHandlerFactory";
import {PublisherFactory} from "../../messaging/PublisherFactory";
import {MessagingServeCommand} from "../../messaging/commands/MessagingServeCommand";
import {CommandRegistry} from "../../console/CommandRegistry";
import {LoggerFactory} from "../../core/logger/LoggerFactory";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.messaging.MessagingBundle", () => {

    it("has own name", () => {

        const subject = new MessagingBundle();

        assert.equal(
            subject.name(),
            "guppy.messaging"
        );
    });

    it("configures an application", () => {

        const subject = new MessagingBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        subject.config(config);

        assert.equal(
            configState.get("guppy.messaging.messageHandlerFactoryClass"),
            DefaultMessageHandlerFactory
        );

        assert.equal(
            configState.get("guppy.messaging.publisherFactoryClass"),
            DefaultPublisherFactory
        );
    });

    it("registers messaging services", () => {

        const subject = new MessagingBundle();
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);
        const container = new Container();

        container.service(
            LoggerFactory,
            mock<LoggerFactory>({
                createLogger(loggerName: string) {
                    
                }
            })
        );

        subject.config(config);
        subject.services(container, configState);

        assert.instanceOf(container.get(ObserverRegistry), ObserverRegistry);
        assert.instanceOf(container.get(DefaultMessageHandlerFactory), DefaultMessageHandlerFactory);
        assert.instanceOf(container.get(DefaultPublisherFactory), DefaultPublisherFactory);
        assert.instanceOf(container.get(MessageHandlerFactory), MessageHandlerFactory);
        assert.instanceOf(container.get(PublisherFactory), PublisherFactory);
        assert.instanceOf(container.get(MessagingServeCommand), MessagingServeCommand);

        const commands = container.get(CommandRegistry).all();
        assert.property(commands, "messaging:serve");
        assert.equal(commands["messaging:serve"], MessagingServeCommand);
    });
});
