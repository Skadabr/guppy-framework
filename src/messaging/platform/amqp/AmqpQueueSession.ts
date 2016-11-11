import { Destination, Consumer, Producer } from "../abstract";
import { NativeSession, NativeQueue, Exchange } from "./common";
import { AmqpConsumer } from "./AmqpConsumer";
import { AmqpSession } from "./AmqpSession";
import { AmqpProducer } from "./AmqpProducer";

const queueExchangeType = "direct";

export class AmqpQueueSession extends AmqpSession {

    /** @internal */
    protected nativeSession: NativeSession;

    /** @internal */
    protected ensureDestinationExists(destination: Destination): Promise<Exchange> {
        return this.nativeSession.assertExchange(
            destination,
            queueExchangeType,
            { durable: true }
        );
    }

    public createConsumer(destination: Destination): Promise<Consumer> {
        return this
            .ensureDestinationExists(destination)
            .then(() => this.nativeSession.prefetch(1))
            .then(() => this.nativeSession.assertQueue(destination, { durable: true }))
            .then((nativeQueue: NativeQueue) => {
                this.nativeSession.bindQueue(nativeQueue.queue, destination, "");
                return nativeQueue;
            })
            .then((nativeQueue: NativeQueue) => new AmqpConsumer(this.nativeSession, nativeQueue.queue));
    }

    public createProducer(destination: Destination): Promise<Producer> {
        return this
            .ensureDestinationExists(destination)
            .then(() => new AmqpProducer(this.nativeSession, destination, true));
    }
}