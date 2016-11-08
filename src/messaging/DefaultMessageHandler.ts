import { MessageHandler } from "./MessageHandler";
import { Consumer, Message } from "./platform/abstract";
import { Class, Logger } from "../core";

export function createMessage<T>(messageClass: { new(): T; }, data: Object): T {
    return Object.assign(new messageClass(), data);
}

export class DefaultMessageHandler<T> extends MessageHandler<T> {

    private consumer: Consumer;
    private handler: (T) => any;
    private messageClass: Class<T>;
    private logger: Logger;

    public constructor(consumer: Consumer, logger: Logger, messageClass: Class<T>, handler: (T) => any) {
        super();
        this.consumer = consumer;
        this.handler = handler;
        this.logger = logger;
        this.messageClass = messageClass;
    }

    public listen(): Promise<void> {

        this.consumer.setMessageListener((message: Message) => {

            const content = message.getRaw().toString();

            const result = this.handler(
                createMessage(this.messageClass as any, JSON.parse(content))
            );

            return (result && typeof result["then"] === "function")
                ? result
                : Promise.resolve();
        });

        return Promise.resolve();
    }
}