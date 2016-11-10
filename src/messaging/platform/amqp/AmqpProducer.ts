import { Producer, Destination } from "../abstract";
import { NativeSession } from "./common";

export class AmqpProducer extends Producer {

    /** @internal */
    private nativeSession: NativeSession;

    /** @internal */
    private destination: Destination;

    /** @internal */
    public constructor(nativeSession: NativeSession, destination: Destination) {
        super();
        this.nativeSession = nativeSession;
        this.destination = destination;
    }

    public send(content: Buffer): void {
        this.nativeSession.publish(this.destination, "", content);
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }
}