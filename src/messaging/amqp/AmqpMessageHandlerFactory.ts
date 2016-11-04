import { Class, Logger } from "../../core";
import { MessageHandlerFactory, MessageHandler } from "../../messaging";
import { AmqpMessageHandler } from "./AmqpMessageHandler";

import * as amqplib from "amqplib";

export class AmqpMessageHandlerFactory extends MessageHandlerFactory {

    private logger: Logger;
    private connection: Promise<amqplib.Connection>;

    public constructor(logger: Logger, connection: Promise<amqplib.Connection>) {
        super();
        this.logger = logger;
        this.connection = connection;
    }

    public createMessageHandler<T>(messageClass: Class<T>, handler: (T) => any): Promise<MessageHandler<T>> {

        let currentChannel: amqplib.Channel;
        let currentQueue: amqplib.Queue;

        return this.connection
            .then((connection: amqplib.Connection) => connection.createChannel() as Promise<amqplib.Channel>)
            .then((channel: amqplib.Channel) => currentChannel = channel)
            .then((channel: amqplib.Channel) => {

                this.logger.trace(
                    `channel.assertExchange("%s", "%s", "%s")`,
                    messageClass["channelName"],
                    "fanout",
                    JSON.stringify({ durable: false })
                );

                return channel.assertExchange(messageClass["channelName"], "fanout", { durable: false });
            })
            .then(() => {

                this.logger.trace(
                    `channel.assertQueue("%s", "%s")`,
                    "",
                    JSON.stringify({ exclusive: true })
                );

                return currentChannel.assertQueue("", { exclusive: true });
            })
            .then((queue: amqplib.Queue) => currentQueue = queue)
            .then((queue: amqplib.Queue) => {

                this.logger.trace(
                    `channel.bindQueue("%s", "%s", "%s")`,
                    queue.queue,
                    messageClass["channelName"],
                    ""
                );

                return currentChannel.bindQueue(queue.queue, messageClass["channelName"], "");
            })
            .then(() => new AmqpMessageHandler<T>(this.logger, messageClass, currentChannel, currentQueue, handler));
    }
}