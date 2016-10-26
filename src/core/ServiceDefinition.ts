export type ServiceFactory = Function;
export type TagValue = any;
export type TagSet = { [tagName: string]: TagValue };

export type ServiceDecorator<T> = (T) => T | Promise<T>;

export class ServiceDefinition {

    private _instance: Object | null = null;
    private _decorators: ServiceDecorator<any>[] = [];

    public constructor(
        private _factory: ServiceFactory,
        private _tags: TagSet
    ) {
    }

    public async instance<T>(): Promise<T> {
        if (this._instance == null) {

            let instance = await this._factory();

            for (const decorate of this._decorators) {
                instance = await decorate(instance);
            }

            this._instance = instance;
        }

        return <T> this._instance;
    }

    public tags(): TagSet {
        return this._tags;
    }

    public registerDecorator<T>(decorator: ServiceDecorator<T>) {
        this._decorators.push(decorator);
    }
}