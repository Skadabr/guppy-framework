export type MessageListener = (message: Message) => Promise<void>;
export type Destination = string;

export enum AcknowledgeMode {
    AutoAcknowledge,
    ClientAcknowledge
}

export abstract class QueueConnectionFactory {
    public abstract createConnection(): Connection;
}

export abstract class TopicConnectionFactory {
    public abstract createConnection(): Connection;
}

export abstract class Connection {
    public abstract createSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): Promise<Session>;
    public abstract close(): Promise<void>;
}

export abstract class Session {
    public abstract createConsumer(destination: Destination): Promise<Consumer>;
    public abstract createProducer(destination: Destination): Promise<Producer>;
    public abstract close(): Promise<void>;
}

export abstract class Message {
    public abstract acknowledge(): void;
    public abstract getRaw(): Buffer;
}

export abstract class Consumer {
    public abstract setMessageListener(messageListener: MessageListener);
    public abstract close(): Promise<void>;
}

export abstract class Producer {
    public abstract send(message: Buffer): void;
    public abstract close(): Promise<void>;
}