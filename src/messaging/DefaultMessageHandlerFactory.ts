import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { Class } from "../core/Container";
import { MessageHandler } from "./MessageHandler";
import { Connection, Session, AcknowledgeMode, Consumer} from "./platform/common";
import { ChannelType } from "./annotations/Message";
import { DefaultMessageHandler } from "./DefaultMessageHandler";

export class DefaultMessageHandlerFactory extends MessageHandlerFactory {

    private connection: Connection;

    private createSession(connection: Connection, channelType: ChannelType): Promise<Session> {
        switch (channelType) {
            case ChannelType.Topic:
                return connection.createTopicSession(false, AcknowledgeMode.AutoAcknowledge);

            case ChannelType.Queue:
                return connection.createQueueSession(false, AcknowledgeMode.AutoAcknowledge);

            default:
                return Promise.reject(
                    new Error("Unsupported channel type")
                );
        }
    }

    public createMessageHandler<T>(messageClass: Class<T>, handler:(T) => any): Promise<MessageHandler<T>> {
        return this
            .createSession(this.connection, messageClass["channelType"])
            .then((session: Session) => session.createConsumer(messageClass["channelName"]))
            .then((consumer: Consumer) => new DefaultMessageHandler(consumer, handler));
    }
}