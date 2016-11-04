import { AmqpPublisherFactory } from "./AmqpPublisherFactory";
import { AmqpMessageHandlerFactory } from "./AmqpMessageHandlerFactory";
import { Logger } from "../../core";

import * as amqplib from "amqplib";

export class AmqpConnection {

    private url: string;
    private logger: Logger;

    public constructor(logger: Logger, url: string) {
        this.logger = logger;
        this.url = url;
    }

    private connection: Promise<amqplib.Connection>;

    private connect(): Promise<amqplib.Connection> {

        if (this.connection === void 0) {
            this.connection = amqplib.connect(this.url);
        }

        return this.connection;
    }

    public createPublisherFactory(): AmqpPublisherFactory {
        return new AmqpPublisherFactory(this.logger, this.connect());
    }

    public createMessageHandlerFactory(): AmqpMessageHandlerFactory {
        return new AmqpMessageHandlerFactory(this.logger, this.connect());
    }
}