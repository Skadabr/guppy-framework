import { Class } from "../../core";
import { Publisher } from "../../messaging";
import * as amqplib from "amqplib";

export class AmqpPublisher<T> extends Publisher<T> {

    private channel: amqplib.Channel;
    private messageClass: Class<T>;
    private queue: string;

    public constructor(channel: amqplib.Channel, messageClass: Class<T>) {
        super();
        this.channel = channel;
        this.messageClass = messageClass;
        this.queue = messageClass["channelName"];
    }

    public publish(message: T): void {

        if (message instanceof this.messageClass) {
            this.channel.publish(
                this.queue,
                "",
                Buffer.from(
                    JSON.stringify(message)
                )
            );
        } else {
            throw new Error("Message isn't supported by current Publisher.")
        }
    }
}
