import { ServiceNotRegistered } from "./ServiceNotRegistered";
import { ServiceDecorator, ServiceFactory, ServiceDefinition } from "./ServiceDefinition";

export interface ClassConstructor<T> extends Function {
    new (...args: any[]): T;
}

export type Class<T> = ClassConstructor<T> | Function;

export class Container {

    private _services: Map<Class<any>, ServiceDefinition> = new Map();

    public constructor() {
        this.instance(Container, this);
    }

    public factory(service: Function, serviceFactory: ServiceFactory) {
        this._services.set(service, new ServiceDefinition(serviceFactory));
        return this;
    }

    public instance(service: Function, instance: Object) {
        this._services.set(service, new ServiceDefinition(() => instance));
        return this;
    }

    public async get<T>(c: Class<T>): Promise<T> {

        if (!this._services.has(c)) {
            throw new ServiceNotRegistered(c.name);
        }

        return this._services.get(c).instance<T>();
    }

    public extend<T>(c: Class<T>, decorator: ServiceDecorator<T>) {

        if (!this._services.has(c)) {
            throw new ServiceNotRegistered(c.name);
        }

        const serviceDefinition = this._services.get(c);

        serviceDefinition.registerDecorator(decorator);

        return this;
    }
}