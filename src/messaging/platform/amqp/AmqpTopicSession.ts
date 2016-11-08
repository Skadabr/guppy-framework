import { Session, Destination, Producer, Consumer } from "../abstract";
import { NativeSession, NativeQueue, Exchange } from "./common";
import { AmqpConsumer } from "./AmqpConsumer";
import { AmqpProducer } from "./AmqpProducer";
import {AmqpSession} from "./AmqpSession";

export const topicExchangeType = "fanout";

export class AmqpTopicSession extends AmqpSession {

    protected ensureDestinationExists(destination: Destination): Promise<Exchange> {
        return this.nativeSession.assertExchange(
            destination,
            topicExchangeType,
            { durable: false }
        );
    }

    public createConsumer(destination: Destination): Promise<Consumer> {

        return this
            .ensureDestinationExists(destination)
            .then(() => this.nativeSession.prefetch(1))
            .then(() => this.nativeSession.assertQueue(destination, { exclusive: true }))
            .then((nativeQueue: NativeQueue) => {
                this.nativeSession.bindQueue(nativeQueue.queue, destination, "");
                return nativeQueue;
            })
            .then((nativeQueue: NativeQueue) => new AmqpConsumer(this.nativeSession, nativeQueue.queue));
    }
}

