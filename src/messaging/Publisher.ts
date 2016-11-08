export abstract class Publisher<T> {
    public abstract publish(message: T): void;
}