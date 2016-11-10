import { Connection } from "../abstract";
import { AmqpConnection } from "./AmqpConnection";
import { NativeSession } from "./common";
import { AmqpSession } from "./AmqpSession";

/** @internal */
export class AmqpConnectionFactory {

    private url: string;
    private amqp: any;

    public constructor(url: string, amqp: any) {
        this.url = url;
        this.amqp = amqp;
    }

    public createConnection(sessionFactory: (nativeSession: NativeSession) => AmqpSession): Connection {
        return new AmqpConnection(
            this.amqp.connect(this.url),
            sessionFactory
        );
    }
}