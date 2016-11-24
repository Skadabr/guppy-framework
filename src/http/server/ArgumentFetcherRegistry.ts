import { Request } from "../Request";
import { Class } from "../../core/Container";

export type ArgumentFetcher<T> = (request: Request) => T;

export const DefaultFetchers = {
    requestFetcher: (request: Request) => request,

    createStringFetcher(argumentName: string): ArgumentFetcher<string> {
        return (request: Request) => request.route[argumentName];
    },

    createNumberFetcher(argumentName: string): ArgumentFetcher<number> {
        return (request: Request) => parseInt(request.route[argumentName]);
    },

    createServiceFetcher<T>(service: T): ArgumentFetcher<T> {
        return (request: Request) => service;
    }
};

export class ArgumentFetcherRegistry {

    private fetchers: Map<Class<any>, ArgumentFetcher<any>> = new Map();

    public has<T>(argumentType: Class<T>): boolean {
        return this.fetchers.has(argumentType);
    }

    public get<T>(argumentType: Class<T>): ArgumentFetcher<T> | null {
        return this.fetchers.get(argumentType);
    }
}