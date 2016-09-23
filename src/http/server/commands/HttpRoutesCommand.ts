import { Command }          from "../../../console/Command";
import { ConsoleInput }     from "../../../console/ConsoleInput";
import { ConsoleOutput }    from "../../../console/ConsoleOutput";

import { PATH_METADATA_KEY }    from "../../annotations/Path";
import { ROUTE_METADATA_KEY }   from "../../annotations/Route";
import { Container }            from "../../../core/Container";
import { MetadataRegistry }     from "../../../core/MetadataRegistry";

import * as Table from "easy-table";

export class HttpRoutesCommand implements Command {

    public constructor(
        private _container: Container
    ) {
    }

    public inputArguments(): Array<string> {
        return [];
    }

    public async execute(input: ConsoleInput, output: ConsoleOutput) {

        const table = new Table();

        for (const route of this.getRouteList()) {
            table.cell("Method", route.method);
            table.cell("Url", route.url);
            table.cell("Handler", `${route.controller.name}.${route.action}`);
            table.newRow();
        }

        output
            .text("Route list:")
            .blank()
            .text(table.toString());
    }

    private getRouteList() {

        const routeList = [];

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
            const prefix = controllerPrefixes[controllerName] || "";

            for (const route of routes.get(handler)) {
                routeList.push({
                    method: route['method'],
                    url: prefix + route['route'],
                    controller: handler.classDefinition,
                    action: handler.name
                });
            }
        }

        return routeList;
    }
}