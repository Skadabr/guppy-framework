// This file is part of: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/amqplib/amqplib.d.ts

declare module "amqplib" {

    import events = require("events");

    interface QueueOptions {
        exclusive?: boolean;
        durable?: boolean;
        autoDelete?: boolean;
        arguments?: any;
        messageTtl?: number;
        expires?: number;
        deadLetterExchange?: string;
        deadLetterRoutingKey?: string;
        maxLength?: number;
    }

    interface Queue {
        queue: string;
        messageCount: number;
        consumerCount: number;
    }

    interface Empty {
    }

    interface ConsumeOptions {
        consumerTag?: string;
        noLocal?: boolean;
        noAck?: boolean;
        exclusive?: boolean;
        priority?: number;
        arguments?: any;
    }

    interface Consume {
        consumerTag: string;
    }

    interface Connection extends events.EventEmitter {
        close(): Promise<void>;
        createChannel(): Promise<Channel>;
    }

    interface ExchangeOptions {
        durable?: boolean;
        internal?: boolean;
        autoDelete?: boolean;
        alternateExchange?: string;
        arguments?: any;
    }

    interface Exchange {
        exchange: string;
    }

    interface Message {
        content: Buffer;
        fields: any;
        properties: any;
    }

    interface PublishOptions {
        expiration?: string;
        userId?: string;
        CC?: string | string[];

        mandatory?: boolean;
        persistent?: boolean;
        deliveryMode?: boolean | number;
        BCC?: string | string[];

        contentType?: string;
        contentEncoding?: string;
        headers?: any;
        priority?: number;
        correlationId?: string;
        replyTo?: string;
        messageId?: string;
        timestamp?: number;
        type?: string;
        appId?: string;
    }

    interface Channel extends events.EventEmitter {
        assertExchange(exchange: string, type: string, options?: ExchangeOptions): Promise<Exchange>;
        assertQueue(queue: string, options?: QueueOptions): Promise<Queue>;
        bindQueue(queue: string, source: string, pattern: string, args?: any): Promise<Empty>;
        consume(queue: string, onMessage: (msg: Message) => any, options?: ConsumeOptions): Promise<Consume>;
        ack(message: Message, allUpTo?: boolean): void;
        publish(exchange: string, routingKey: string, content: Buffer, options?: PublishOptions): boolean;
        prefetch(count: number, global?: boolean): Promise<Empty>;
        close(): Promise<void>;
    }

    function connect(url: string, socketOptions?: any): Promise<Connection>;
}