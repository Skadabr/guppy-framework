import { Producer, Destination } from "../common";
import { NativeSession } from "./common";

export class AmqpProducer extends Producer {

    private nativeSession: NativeSession;
    private destination: Destination;

    public constructor(nativeSession: NativeSession, destination: Destination) {
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