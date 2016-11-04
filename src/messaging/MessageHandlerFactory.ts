import { MessageHandler } from "./MessageHandler";
import { Class } from "../core/Container";

export abstract class MessageHandlerFactory {

    public abstract createMessageHandler<T>(messageClass: Class<T>, handler: (T) => any): Promise<MessageHandler<T>>;
}