export interface ObserverMetadata {
    observerClass: Function;
    observerMethod: string;
}

export class ObserverRegistry {

    private static orservers: Map<Function, ObserverMetadata> = new Map();

    public static prebootRegister(messageClass: Function, observer: ObserverMetadata) {
        ObserverRegistry.orservers.set(messageClass, observer);
    }

    private orservers: Map<Function, ObserverMetadata>;

    public constructor(ignorePrebootData?: boolean) {
        this.orservers = ignorePrebootData
            ? new Map()
            : new Map(ObserverRegistry.orservers);
    }

    public all(): Map<Function, ObserverMetadata> {
        return this.orservers;
    }
}