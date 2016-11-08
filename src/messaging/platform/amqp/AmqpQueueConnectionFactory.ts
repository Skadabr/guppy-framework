import { QueueConnectionFactory, Connection } from "../abstract";
import { AmqpConnectionFactory } from "./AmqpConnectionFactory";
import {NativeSession} from "./common";
import {AmqpQueueSession} from "./AmqpQueueSession";

export class AmqpQueueConnectionFactory extends QueueConnectionFactory {

    private connectionFactory: AmqpConnectionFactory;

    public constructor(connectionFactory: AmqpConnectionFactory) {
        super();
        this.connectionFactory = connectionFactory;
    }

    public createConnection(): Connection {
        return this.connectionFactory.createConnection(
            (nativeSession: NativeSession) => new AmqpQueueSession(nativeSession)
        );
    }
}