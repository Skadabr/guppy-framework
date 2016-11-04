import { Publisher } from "./Publisher";
import { Class } from "../core/Container";

export abstract class PublisherFactory {
    public abstract createPublisher<T>(messageClass: Class<T>): Promise<Publisher<T>>;
}