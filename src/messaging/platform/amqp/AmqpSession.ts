import { Session, Destination, Producer, Consumer } from "../abstract";
import { NativeSession, Exchange } from "./common";
import { AmqpProducer } from "./AmqpProducer";

export abstract class AmqpSession extends Session {

    protected nativeSession: NativeSession;

    public constructor(nativeSession: NativeSession) {
        super();
        this.nativeSession = nativeSession;
    }

    protected abstract ensureDestinationExists(destination: Destination): Promise<Exchange>;

    public abstract createConsumer(destination: Destination): Promise<Consumer>;

    public createProducer(destination: Destination): Promise<Producer> {
        return this
            .ensureDestinationExists(destination)
            .then(() => new AmqpProducer(this.nativeSession, destination));
    }

    public close(): Promise<void> {
        return this.nativeSession.close();
    }
}