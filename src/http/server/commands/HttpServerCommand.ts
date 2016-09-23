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
        private _serverPort: number | null
    ) {
    }

    public inputArguments(): Array<string> {
        return [
            'directory'
        ];
    }

    public async execute(input: ConsoleInput, output: ConsoleOutput) {

        let serverPort: number = input.optionAsInt('port') || this._serverPort || DEFAULT_HTTP_PORT;

        this._routeLoader.load();
        this._httpServer
            .listen(serverPort)
            .then(() => console.log(`Server has been started on ${serverPort} port.`));
    }
}