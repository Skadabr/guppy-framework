import { ConnectionFactory, Connection} from "../common";
import { AmqpConnection } from "./AmqpConnection";

export class AmqpConnectionFactory extends ConnectionFactory {

    private url: string;
    private amqp: any;

    public constructor(url: string, amqp: any) {
        super();
        this.url = url;
        this.amqp = amqp;
    }

    public createConnection(): Connection {
        return new AmqpConnection(
            this.amqp.connect(this.url)
        );
    }
}