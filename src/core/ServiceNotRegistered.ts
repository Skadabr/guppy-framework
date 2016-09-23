export class ServiceNotRegistered extends Error {
    constructor(serviceKey) {
        super(`Service "${serviceKey}" is not registered.`);
        this.name = 'ServiceNotRegistered';
    }
}