import { PublisherFactory } from "./PublisherFactory";
import { Publisher } from "./Publisher";
import { Class } from "../core/Container";

export class StubPublisherFactory extends PublisherFactory {

    public createPublisher<T>(messageClass: Class<T>): Promise<Publisher<T>> {
        throw new Error("Please, install messaging driver.");
    }
}