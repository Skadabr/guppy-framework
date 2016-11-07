import { MessageHandler } from "./MessageHandler";
import { Consumer } from "./platform/common";

export class DefaultMessageHandler<T> extends MessageHandler {

    private consumer: Consumer;
    private handler: (T) => any;

    public constructor(consumer:Consumer, handler:(T) => any) {
        this.consumer = consumer;
        this.handler = handler;
    }

    public listen(): Promise<void> {
        return undefined;
    }
}