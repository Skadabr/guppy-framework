import { ServiceNotRegistered } from "./ServiceNotRegistered";
import { ServiceFactory, ServiceDefinition, TagSet } from "./ServiceDefinition";

export interface ClassConstructor<T> extends Function {
    new (...args: any[]): T;
}

export type Class<T> = ClassConstructor<T> | Function;

export class Container {

    private _services: Map<Class<any>, ServiceDefinition> = new Map();

    public factory(service: Function, serviceFactory: ServiceFactory, tags?: TagSet) {

        this._services.set(
            service,
            new ServiceDefinition(serviceFactory, tags || {})
        );

        return this;
    }

    public instance(service: Function, instance: Object, tags?: TagSet) {

        this._services.set(
            service,
            new ServiceDefinition(async () => instance, tags || {})
        );

        return this;
    }

    public get<T>(c: Class<T>): Promise<T> {

        if (!this._services.has(c)) {
            throw new ServiceNotRegistered(c.name);
        }

        return this._services.get(c).instance();
    }

    public byTag(tagName: string): Array<ServiceDefinition> {

        let services: ServiceDefinition[] = [];

        for (const serviceDefinition of this._services.values()) {
            if (serviceDefinition.tags().hasOwnProperty(tagName)) {
                services.push(serviceDefinition);
            }
        }

        return services;
    }
}