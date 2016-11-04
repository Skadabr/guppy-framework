import { Message, ChannelType } from "./Message";

export function Queue(queueName: string): Function {
    return Message(ChannelType.Queue, queueName, Queue);
}