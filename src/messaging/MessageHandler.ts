export abstract class MessageHandler<T> {

    public abstract listen(): Promise<void>;
}