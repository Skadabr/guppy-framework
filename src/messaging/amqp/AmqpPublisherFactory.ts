import * as amqplib from "amqplib";

import { PublisherFactory } from "../../messaging";
import { Class, Logger } from "../../core";
import { AmqpPublisher } from "./AmqpPublisher";

export class AmqpPublisherFactory extends PublisherFactory {

    private connection: Promise<amqplib.Connection>;
    private logger: Logger;

    public constructor(logger: Logger, connection: Promise<amqplib.Connection>) {
        super();
        this.logger = logger;
        this.connection = connection;
    }

    public createPublisher<T>(messageClass: Class<T>): Promise<AmqpPublisher<T>> {

        return this.connection
            .then((connection: amqplib.Connection) => connection.createChannel() as Promise<amqplib.Channel>)
            .then((channel: amqplib.Channel) => {
                channel.assertQueue(messageClass["channelName"], { durable: true });
                return new AmqpPublisher(channel, messageClass);
            });
    }
}