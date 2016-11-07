import { Consumer, MessageListener } from "../common";
import { NativeSession, NativeQueue, NativeMessage } from "./common";
import { AmqpMessage } from "./AmqpMessage";

export class AmqpConsumer extends Consumer {

    private nativeSession: NativeSession;
    private nativeQueue: NativeQueue;

    public constructor(nativeSession: NativeSession, nativeQueue: NativeQueue) {
        this.nativeSession = nativeSession;
        this.nativeQueue = nativeQueue;
    }

    public setMessageListener(messageListener: MessageListener) {
        this.nativeSession.consume(this.nativeQueue.queue, (nativeMessage: NativeMessage) => {
            const message = new AmqpMessage(this.nativeSession, nativeMessage);
            messageListener(message).then(() => message.acknowledge());
        });
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }
}