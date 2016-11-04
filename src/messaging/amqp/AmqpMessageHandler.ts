import { MessageHandler } from "../../messaging";
import { Class, Logger } from "../../core";

import * as amqplib from "amqplib";

export function createMessage<T>(messageClass: { new(): T; }, data: Object): T {
    return Object.assign(new messageClass(), data);
}

export class AmqpMessageHandler<T> extends MessageHandler<T> {

    private messageClass: Class<T>;
    private channel: amqplib.Channel;
    private queue: amqplib.Queue;
    private handler: (T) => any;
    private logger: Logger;

    public constructor(logger: Logger, messageClass: Class<T>, channel: amqplib.Channel, queue: amqplib.Queue, handler: (T) => any) {
        super();
        this.logger = logger;
        this.messageClass = messageClass;
        this.channel = channel;
        this.handler = handler;
        this.queue = queue;
    }

    public listen(): Promise<void> {

        return this.channel
            .consume(
                this.queue.queue,
                (message: amqplib.Message) => {

                    const content = message.content.toString();

                    this.logger.debug(
                        `Received message from "%s" with next content: %s`,
                        this.messageClass["channelName"],
                        content
                    );

                    const result = this.handler(
                        createMessage(this.messageClass as any, JSON.parse(content))
                    );

                    if (result && typeof result["then"] === "function") {
                        result.then(() => this.channel.ack(message));
                    } else {
                        this.channel.ack(message);
                    }
                },
                { noAck: false }
            )
            .then(() => {})
    }
}
