import { Command }          from "../../../console/Command";
import { ConsoleInput }     from "../../../console/ConsoleInput";
import { ConsoleOutput }    from "../../../console/ConsoleOutput";

import { HttpServer }   from "./../HttpServer";
import { RouteLoader }  from "./../RouteLoader";

export const DEFAULT_HTTP_PORT = 8082;

export class HttpServerCommand implements Command {

    public constructor(
        private _httpServer: HttpServer,
        private _routeLoader: RouteLoader,
        private _serverPort?: number
    ) {
    }

    public inputArguments(): string[] {
        return [];
    }

    public execute(input: ConsoleInput, output: ConsoleOutput) {

        let serverPort: number = input.optionAsInt('port') || this._serverPort || DEFAULT_HTTP_PORT;

        this._routeLoader.load();

        return this._httpServer
            .listen(serverPort)
            .then(() => output.info(`Server has been started on ${serverPort} port.`));
    }

    public get serverPort(): number {
        return this._serverPort;
    }
}