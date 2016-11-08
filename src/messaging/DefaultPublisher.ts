import { Publisher } from "./Publisher";
import { Producer } from "./platform/abstract";
import { Logger } from "../core";

export class DefaultPublisher<T> extends Publisher<T> {

    private logger: Logger;
    private producer: Producer;

    public constructor(logger: Logger, producer: Producer) {
        super();
        this.logger = logger;
        this.producer = producer;
    }

    public publish(message: T): void {
        const content = JSON.stringify(message);

        this.logger.trace("Published message: %s", content);

        this.producer.send(
            Buffer.from(content)
        );
    }
}