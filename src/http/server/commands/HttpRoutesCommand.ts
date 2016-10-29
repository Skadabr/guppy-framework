import { Command }          from "../../../console/Command";
import { ConsoleInput }     from "../../../console/ConsoleInput";
import { ConsoleOutput }    from "../../../console/ConsoleOutput";
import { RouteRegistry }    from "../RouteRegistry";

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
            table.cell("Method", route.method);
            table.cell("Url", route.route);
            table.cell("Handler", `${route.controllerClass.name}.${route.handlerName}`);
            table.newRow();
        }

        output
            .text("Route list:")
            .blank()
            .text(table.toString());
    }
}