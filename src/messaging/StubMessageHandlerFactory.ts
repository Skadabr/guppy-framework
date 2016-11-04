import { MessageHandlerFactory } from "./MessageHandlerFactory";
import { MessageHandler } from "./MessageHandler";
import { Class } from "../core/Container";

export class StubMessageHandlerFactory extends MessageHandlerFactory {

    public createMessageHandler<T>(messageClass: Class<T>, handler: (T) => any): Promise<MessageHandler<T>> {
        throw new Error("Please, install messaging driver.");
    }
}
