export type MessageListener = (message: Message) => void;
export type Destination = string;

export enum AcknowledgeMode {
    AutoAcknowledge,
    ClientAcknowledge
}

export interface ConnectionFactory {

}

export interface Connection {
    start(): void;
    close();
}

export interface Session {
    createTextMessage(content: string): Message;
    createMessage(content: Buffer): Message;
    close();
}

export interface Message {
    acknowledge();
    getRaw(): Buffer;
}

export interface MessageConsumer {
    setMessageListener(messageListener: MessageListener);
    close();
}

export interface MessageProducer {
    send(message: Message);
    close();
}