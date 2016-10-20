import { MetadataRegistry } from "../../core/MetadataRegistry";
import { PATH_METADATA_KEY } from "../annotations/Path";
import { ROUTE_METADATA_KEY } from "../annotations/Route";
import { Container } from "../../core/Container";
import { HandlerResolver } from "./HandlerResolver";

import "reflect-metadata";

export class RouteLoader {

    public constructor(
        private _container: Container,
        private _handlerResolver: HandlerResolver
    ) {
    }

    public async load() {

        let controllerPrefixes: { [key: string]: string } = {};

        const prefixes = MetadataRegistry.classesByMetadataKey(PATH_METADATA_KEY);

        for (const controller of prefixes.keys()) {
            for (const prefix of prefixes.get(controller) ) {
                controllerPrefixes[controller.name] = prefix["path"];
            }
        }

        const routes = MetadataRegistry.membersByMetadataKey(ROUTE_METADATA_KEY);

        for (let handler of routes.keys()) {
            const controllerName = handler.classDefinition.name;
            const methodName = handler.name;
            
            const prefix = controllerPrefixes[controllerName] || "";
            const controller = await this._container.get(handler.classDefinition);

            const handlerArguments = Reflect.getMetadata(
                "design:paramtypes",
                handler.classDefinition.prototype,
                handler.name
            );

            for (const route of routes.get(handler)) {
                this._handlerResolver.registerHandler(
                    route['method'],
                    prefix + route['route'],
                    controller,
                    methodName,
                    handlerArguments
                );
            }
        }
    }
}
