import { Session, Destination, Producer, Consumer } from "../common";
import { NativeSession, NativeQueue, Exchange } from "./common";
import { AmqpConsumer } from "./AmqpConsumer";
import { AmqpProducer } from "./AmqpProducer";

export abstract class AmqpSession extends Session {

    protected nativeSession: NativeSession;

    public constructor(nativeSession: NativeSession) {
        this.nativeSession = nativeSession;
    }

    protected abstract ensureDestinationExists(destination: Destination): Promise<Exchange>;

    public createConsumer(destination: Destination): Promise<Consumer> {
        return this
            .ensureDestinationExists(destination)
            .then(() => this.nativeSession.prefetch(1))
            .then(() => this.nativeSession.assertQueue("", { exclusive: true }))
            .then((nativeQueue: NativeQueue) => new AmqpConsumer(this.nativeSession, nativeQueue));
    }

    public createProducer(destination: Destination): Promise<Producer> {
        return this
            .ensureDestinationExists(destination)
            .then(() => new AmqpProducer(this.nativeSession, destination));
    }

    public close(): Promise<void> {
        return this.nativeSession.close();
    }
}