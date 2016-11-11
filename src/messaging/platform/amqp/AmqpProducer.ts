import { Producer, Destination } from "../abstract";
import { NativeSession } from "./common";

export class AmqpProducer extends Producer {

    /** @internal */
    private nativeSession: NativeSession;

    /** @internal */
    private destination: Destination;

    /** @internal */
    private persistent: boolean;

    /** @internal */
    public constructor(nativeSession: NativeSession, destination: Destination, persistent: boolean) {
        super();
        this.nativeSession = nativeSession;
        this.destination = destination;
        this.persistent = persistent;
    }

    public send(content: Buffer): void {
        this.nativeSession.publish(
            this.destination,
            "",
            content,
            { persistent: this.persistent }
        );
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }
}