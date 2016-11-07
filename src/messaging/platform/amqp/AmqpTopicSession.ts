import { Destination } from "../common";
import { Exchange } from "./common";
import { AmqpSession } from "./AmqpSession";

export class AmqpTopicSession extends AmqpSession {

    protected ensureDestinationExists(destination: Destination): Promise<Exchange> {
        return this.nativeSession.assertExchange(destination, "fanout", { durable: false });
    }
}
