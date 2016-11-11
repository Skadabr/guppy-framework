import { Session, Destination, Producer, Consumer } from "../abstract";
import { NativeSession, Exchange } from "./common";

export abstract class AmqpSession extends Session {

    /** @internal */
    protected nativeSession: NativeSession;

    /** @internal */
    public constructor(nativeSession: NativeSession) {
        super();
        this.nativeSession = nativeSession;
    }

    /** @internal */
    protected abstract ensureDestinationExists(destination: Destination): Promise<Exchange>;

    public abstract createConsumer(destination: Destination): Promise<Consumer>;
    public abstract createProducer(destination: Destination): Promise<Producer>;

    public close(): Promise<void> {
        return this.nativeSession.close();
    }
}