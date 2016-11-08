import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { Class, Logger } from "../core";
import { MessageHandler } from "./MessageHandler";
import { Session, AcknowledgeMode, Consumer, TopicConnectionFactory, QueueConnectionFactory } from "./platform/abstract";
import { ChannelType } from "./annotations/Message";
import { DefaultMessageHandler } from "./DefaultMessageHandler";

export class DefaultMessageHandlerFactory extends MessageHandlerFactory {

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

    public createMessageHandler<T>(messageClass: Class<T>, handler: (T) => any): Promise<MessageHandler<T>> {

        return this
            .createSession(messageClass["channelType"])
            .then((session: Session) => session.createConsumer(messageClass["channelName"]))
            .then((consumer: Consumer) => new DefaultMessageHandler(
                consumer,
                this.logger,
                messageClass,
                handler
            ));
    }
}