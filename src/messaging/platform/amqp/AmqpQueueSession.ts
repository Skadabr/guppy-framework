import { Exchange } from "./common";
import { Destination } from "../common";
import { AmqpSession } from "./AmqpSession";

export class AmqpQueueSession extends AmqpSession {

    protected ensureDestinationExists(destination: Destination): Promise<Exchange> {
        return this.nativeSession.assertExchange(destination, "direct", { durable: false });
    }
}