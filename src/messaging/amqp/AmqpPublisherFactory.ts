import * as amqplib from "amqplib";

import { PublisherFactory } from "../../messaging";
import { Class, Logger } from "../../core";
import { AmqpPublisher } from "./AmqpPublisher";
import {ChannelType} from "../annotations/Message";

export class AmqpPublisherFactory extends PublisherFactory {

    private connection: Promise<amqplib.Connection>;
    private logger: Logger;

    public constructor(logger: Logger, connection: Promise<amqplib.Connection>) {
        super();
        this.logger = logger;
        this.connection = connection;
    }

    public createPublisher<T>(messageClass: Class<T>): Promise<AmqpPublisher<T>> {

        let currentChannel: amqplib.Channel;

        return this.connection
            .then((connection: amqplib.Connection) => connection.createChannel() as Promise<amqplib.Channel>)
            .then((channel: amqplib.Channel) => currentChannel = channel)
            .then((channel: amqplib.Channel) => {

                const exchangeType: string = messageClass["channelType"] === ChannelType.Queue ? "direct" : "fanout";

                this.logger.trace(
                    `channel.assertExchange("%s", "%s", %s)`,
                    messageClass["channelName"],
                    exchangeType,
                    JSON.stringify({ durable: false })
                );

                return channel.assertExchange(
                    messageClass["channelName"],
                    exchangeType,
                    { durable: false }
                );
            })
            .then(() => new AmqpPublisher(currentChannel, messageClass));
    }
}