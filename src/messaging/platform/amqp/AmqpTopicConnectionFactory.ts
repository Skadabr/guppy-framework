import { TopicConnectionFactory, Connection } from "../abstract";
import { AmqpConnectionFactory } from "./AmqpConnectionFactory";
import { NativeSession } from "./common";
import { AmqpTopicSession } from "./AmqpTopicSession";

export class AmqpTopicConnectionFactory extends TopicConnectionFactory {

    private connectionFactory: AmqpConnectionFactory;

    public constructor(connectionFactory:AmqpConnectionFactory) {
        super();
        this.connectionFactory = connectionFactory;
    }

    public createConnection(): Connection {
        return this.connectionFactory.createConnection(
            (nativeSession: NativeSession) => new AmqpTopicSession(nativeSession)
        );
    }
}