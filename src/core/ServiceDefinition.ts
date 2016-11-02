export type ServiceFactory = Function;

export type ServiceDecorator<T> = (T) => T | any;

export class ServiceDefinition {

    private _instance: Object | null = null;
    private _decorators: ServiceDecorator<any>[] = [];

    public constructor(private _factory: ServiceFactory) {
    }

    public instance<T>(): T {
        if (this._instance == null) {

            let instance = this._factory();

            let result;
            for (const decorate of this._decorators) {
                result = decorate(instance);
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