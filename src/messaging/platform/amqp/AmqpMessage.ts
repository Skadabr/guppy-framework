import { Message } from "../abstract";
import { NativeSession, NativeMessage } from "./common";

export class AmqpMessage extends Message {

    /** @internal */
    private nativeSession: NativeSession;

    /** @internal */
    private nativeMessage: NativeMessage;

    /** @internal */
    public constructor(nativeSession: NativeSession, nativeMessage: NativeMessage) {
        super();
        this.nativeSession = nativeSession;
        this.nativeMessage = nativeMessage;
    }

    public acknowledge(): void {
        this.nativeSession.ack(this.nativeMessage);
    }

    public getRaw(): Buffer {
        return this.nativeMessage.content;
    }
}