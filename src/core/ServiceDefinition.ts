export type ServiceFactory = Function;

export type ServiceDecorator<T> = (T) => T | Promise<T> | any;

export class ServiceDefinition {

    private _instance: Object | null = null;
    private _decorators: ServiceDecorator<any>[] = [];

    public constructor(private _factory: ServiceFactory) {
    }

    public async instance<T>(): Promise<T> {
        if (this._instance == null) {

            let instance = await this._factory();

            let result;
            for (const decorate of this._decorators) {
                result = await decorate(instance);
                if (result instanceof instance.constructor) instance = result;
            }

            this._instance = instance;
        }

        return <T> this._instance;
    }

    public registerDecorator<T>(decorator: ServiceDecorator<T>) {
        this._decorators.push(decorator);
    }
}