import { Message } from "../common";
import { NativeSession, NativeMessage } from "./common";

export class AmqpMessage extends Message {

    private nativeSession: NativeSession;
    private nativeMessage: NativeMessage;

    public constructor(nativeSession: NativeSession, nativeMessage: NativeMessage) {
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