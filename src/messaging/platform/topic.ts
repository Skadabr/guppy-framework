import {
    Message, MessageConsumer, MessageProducer, AcknowledgeMode, Destination, Session, Connection,
    ConnectionFactory
} from "./common";

export type Topic = Destination;

export interface TopicConnectionFactory extends ConnectionFactory {
    createTopicConnection(): TopicConnection;
}

export interface TopicConnection extends Connection {
    createTopicSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): TopicSession;
}

export interface TopicSession extends Session {
    createSubscriber(topic: Topic): TopicSubscriber;
    createPublisher(topic: Topic): TopicPublisher;
    close(): void;
}

export interface TopicSubscriber extends MessageConsumer {
    
}

export interface TopicPublisher extends MessageProducer {
    publish(message: Message);
}