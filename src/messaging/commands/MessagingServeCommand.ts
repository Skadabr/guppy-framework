import { Container } from "../../core";
import { Command, ConsoleInput, ConsoleOutput } from "../../console";
import { ObserverRegistry, ObserverMetadata, MessageHandlerFactory, MessageHandler } from "..";

export class MessagingServeCommand extends Command {

    public constructor(
        private container: Container,
        private observerRegistry: ObserverRegistry,
        private messageHandlerFactory: MessageHandlerFactory
    ) {
        super();
    }

    public inputArguments(): string[] {
        return [];
    }

    public execute(input: ConsoleInput, output: ConsoleOutput): void {

        const observers: Map<Function, ObserverMetadata> = this.observerRegistry.all();

        const messageHandlersPromises: Promise<MessageHandler<any>>[] = [];

        for (const messageClass of observers.keys()) {

            const observerMetadata = observers.get(messageClass);
            const observer = this.container.get(observerMetadata.observerClass);

            messageHandlersPromises.push(
                this.messageHandlerFactory.createMessageHandler(
                    messageClass,
                    observer[observerMetadata.observerMethod].bind(observer)
                )
            );
        }

        Promise
            .all(messageHandlersPromises)
            .then((messageHandlers: MessageHandler<any>[]) => messageHandlers.map(messageHandle => messageHandle.listen()))
            .then(() => output.info(`${messageHandlersPromises.length} workers started processing.`));
    }
}