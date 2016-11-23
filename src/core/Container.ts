import { ServiceNotRegistered } from "./ServiceNotRegistered";
import { ServiceDecorator, ServiceFactory, ServiceDefinition } from "./ServiceDefinition";

export interface ClassConstructor<T> extends Function {
    new (...args: any[]): T;
}

export type Class<T> = ClassConstructor<T> | Function;

export function create<T>(
    targetClass: { new(...dependencies: any[]): T; },
    dependencies?: any[]
): T {
    return (dependencies === void 0)
        ? new targetClass()
        : new targetClass(...dependencies);
}

export class Container {

    private _services: Map<Class<any>, ServiceDefinition> = new Map();

    public constructor() {
        this.service(Container, this);
    }

    public bind<T>(abstractClass: Class<T>, implementation: Class<any>): Container {
        this._services.set(
            abstractClass,
            new ServiceDefinition(() => this.get(implementation))
        );
        return this;
    }

    public factory<T>(targetClass: Class<T>, serviceFactory: ServiceFactory) {
        this._services.set(targetClass, new ServiceDefinition(serviceFactory, true));
        return this;
    }

    public service<T>(targetClass: Class<T>, objectProvider: ServiceFactory | Object | Class<any>[]) {

        if (objectProvider instanceof Function) {
            this._services.set(targetClass, new ServiceDefinition(objectProvider as ServiceFactory));

            return this;
        }

        if (objectProvider instanceof Array) {
            this._services.set(
                targetClass,
                new ServiceDefinition(() => create(
                    targetClass as any,
                    (objectProvider as Class<any>[]).map(dependencyClass => this.get(dependencyClass))
                ))
            );

            return this;
        }

        this._services.set(targetClass, new ServiceDefinition(() => objectProvider as Object));

        return this;
    }

    public get<T>(targetClass: Class<T>): T {

        if (!this._services.has(targetClass)) {
            if (targetClass.length > 0) {
                throw new ServiceNotRegistered(targetClass.name);
            }
            this._services.set(targetClass, new ServiceDefinition(() => create(targetClass as any, [])));
        }

        return this._services.get(targetClass).instance<T>();
    }

    public extend<T>(targetClass: Class<T>, decorator: ServiceDecorator<T>) {

        if (!this._services.has(targetClass)) {
            if (targetClass.length > 0) {
                throw new ServiceNotRegistered(targetClass.name);
            }
            this._services.set(targetClass, new ServiceDefinition(() => create(targetClass as any, [])));
        }

        const serviceDefinition = this._services.get(targetClass);

        serviceDefinition.registerDecorator(decorator);

        return this;
    }
}