import { PublisherFactory } from "./PublisherFactory";
import { Publisher } from "./Publisher";
import { Logger, Class } from "../core";
import { TopicConnectionFactory, QueueConnectionFactory, Session, AcknowledgeMode, Producer } from "./platform/abstract";
import { ChannelType } from "./annotations/Message";
import { DefaultPublisher } from "./DefaultPublisher";

export class DefaultPublisherFactory extends PublisherFactory {

    private topicConnectionFactory: TopicConnectionFactory;
    private queueConnectionFactory: QueueConnectionFactory;
    private logger: Logger;

    public constructor(
        topicConnectionFactory: TopicConnectionFactory,
        queueConnectionFactory: QueueConnectionFactory,
        logger: Logger
    ) {
        super();
        this.topicConnectionFactory = topicConnectionFactory;
        this.queueConnectionFactory = queueConnectionFactory;
        this.logger = logger;
    }

    private createSession(channelType: ChannelType): Promise<Session> {

        switch (channelType) {
            case ChannelType.Topic:
                return this
                    .topicConnectionFactory
                    .createConnection()
                    .createSession(false, AcknowledgeMode.AutoAcknowledge);

            case ChannelType.Queue:
                return this
                    .queueConnectionFactory
                    .createConnection()
                    .createSession(false, AcknowledgeMode.AutoAcknowledge);

            default:
                return Promise.reject(
                    new Error("Unsupported channel type")
                );
        }
    }

    public createPublisher<T>(messageClass: Class<T>): Promise<Publisher<T>> {

        return this
            .createSession(messageClass["channelType"])
            .then((session: Session) => session.createProducer(messageClass["channelName"]))
            .then((producer: Producer) => {
                this.logger.debug(`Created publisher for "%s"`, messageClass["channelName"]);
                return new DefaultPublisher(this.logger, producer);
            });
    }
}