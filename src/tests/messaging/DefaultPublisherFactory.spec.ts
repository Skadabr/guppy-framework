import { DefaultPublisherFactory } from "../../messaging/DefaultPublisherFactory";
import { TopicConnectionFactory, QueueConnectionFactory, Connection, Session } from "../../messaging/platform/abstract/index";
import { Logger } from "../../core/logger/Logger";
import { Topic, Queue, Publisher, PublisherFactory, DefaultPublisher } from "../../messaging";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.messaging.DefaultPublisherFactory", () => {

    it("can be instantiated", () => {

        const subject = new DefaultPublisherFactory(
            mock<TopicConnectionFactory>(),
            mock<QueueConnectionFactory>(),
            mock<Logger>()
        );

        assert.ok(subject instanceof PublisherFactory);
    });

    it("creates topic session", () => {

        let debugBuffer = "";

        const logger = mock<Logger>({
            debug(message: string, ...data:any[]) {
                debugBuffer += message + " " + JSON.stringify(data);
            }
        });

        const producer = {};

        const subject = new DefaultPublisherFactory(
            mock<TopicConnectionFactory>({
                createConnection() {
                    return mock<Connection>({
                        createSession: () => Promise.resolve(
                            mock<Session>({
                                createProducer: () => Promise.resolve(producer)
                            })
                        )
                    });
                }
            }),
            mock<QueueConnectionFactory>(),
            logger
        );

        @Topic("test.message-one")
        class TestMessage { }

        return subject
            .createPublisher(TestMessage)
            .then((publisher: Publisher<TestMessage>) => {
                assert.ok(publisher instanceof DefaultPublisher);
                assert.equal(debugBuffer, `Created publisher for "%s" ["test.message-one"]`);
            });
    });

    it("creates queue session", () => {

        let debugBuffer = "";

        const logger = mock<Logger>({
            debug(message: string, ...data:any[]) {
                debugBuffer += message + " " + JSON.stringify(data);
            }
        });

        const producer = {};

        const subject = new DefaultPublisherFactory(
            mock<TopicConnectionFactory>(),
            mock<QueueConnectionFactory>({
                createConnection() {
                    return mock<Connection>({
                        createSession: () => Promise.resolve(
                            mock<Session>({
                                createProducer: () => Promise.resolve(producer)
                            })
                        )
                    });
                }
            }),
            logger
        );

        @Queue("test.message-one")
        class TestMessage { }

        return subject
            .createPublisher(TestMessage)
            .then((publisher: Publisher<TestMessage>) => {
                assert.ok(publisher instanceof DefaultPublisher);
                assert.equal(debugBuffer, `Created publisher for "%s" ["test.message-one"]`);
            });
    });
});