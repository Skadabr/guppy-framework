import { Consumer, MessageListener, Destination } from "../abstract";
import { NativeSession, NativeQueue, NativeMessage } from "./common";
import { AmqpMessage } from "./AmqpMessage";

export class AmqpConsumer extends Consumer {

    private nativeSession: NativeSession;
    private destination: Destination;

    public constructor(nativeSession: NativeSession, destination: Destination) {
        super();
        this.nativeSession = nativeSession;
        this.destination = destination;
    }

    public setMessageListener(messageListener: MessageListener) {
        this.nativeSession.consume(this.destination, (nativeMessage: NativeMessage) => {
            const message = new AmqpMessage(this.nativeSession, nativeMessage);
            messageListener(message).then(() => message.acknowledge());
        });
    }

    public close(): Promise<void> {
        return Promise.resolve();
    }
}