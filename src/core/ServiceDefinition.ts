export type ServiceFactory = Function;

export type ServiceDecorator<T> = (T) => T | any;

export class ServiceDefinition {

    private _instance: Object | null = null;
    private _decorators: ServiceDecorator<any>[] = [];

    public constructor(
        private _objectProvider: ServiceFactory,
        private _isFactory?: boolean
    ) {
        if (this._isFactory === void 0) this._isFactory = false;
    }

    public instance<T>(): T {

        if (this._isFactory || this._instance == null) {

            let instance = this._objectProvider();
            let instanceClass = instance.constructor;

            for (const decorate of this._decorators) {
                let result = decorate(instance);
                if (result instanceof instanceClass) {
                    instance = result;
                }
            }

            this._instance = instance;
        }

        return <T> this._instance;
    }

    public registerDecorator<T>(decorator: ServiceDecorator<T>) {
        this._decorators.push(decorator);
    }
}