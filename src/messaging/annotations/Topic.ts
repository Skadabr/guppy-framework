import { Message, ChannelType } from "./Message";

export function Topic(topicName: string): Function {
    return Message(ChannelType.Topic, topicName, Topic);
}