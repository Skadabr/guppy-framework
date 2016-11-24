import { Command }          from "../../../console/Command";
import { ConsoleInput }     from "../../../console/ConsoleInput";
import { ConsoleOutput }    from "../../../console/ConsoleOutput";
import { RouteRegistry, RoutePrefix } from "../RouteRegistry";

import * as Table from "easy-table";

export class HttpRoutesCommand implements Command {

    public constructor(
        private routeRegistry: RouteRegistry
    ) {
    }

    public inputArguments(): Array<string> {
        return [];
    }

    public async execute(input: ConsoleInput, output: ConsoleOutput) {

        const table = new Table();
        const routes = this.routeRegistry.all();

        if (routes.length < 1) {
            output.text("No registered routes.");
            return;
        }

        for (const route of routes) {

            const routePrefix = route.controllerClass[RoutePrefix] || "";
            const routePath = routePrefix + route.route;

            table.cell("Method", route.method);
            table.cell("Url", routePath || "/");
            table.cell("Handler", `${route.controllerClass.name}.${route.handlerName}`);
            table.newRow();
        }

        output
            .text("Route list:")
            .blank()
            .text(table.toString());
    }
}