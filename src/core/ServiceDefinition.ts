export type ServiceFactory = Function;
export type TagValue = any;
export type TagSet = { [tagName: string]: TagValue };

export class ServiceDefinition {

    private _instance: Object | null = null;

    public constructor(
        private _factory: ServiceFactory,
        private _tags: TagSet
    ) {
    }

    public async instance<T>(): Promise<T> {
        if (this._instance == null) {
            this._instance = await this._factory();
        }

        return <T> this._instance;
    }

    public tags(): TagSet {
        return this._tags;
    }
}