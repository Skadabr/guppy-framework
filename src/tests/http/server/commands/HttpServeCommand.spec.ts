import assert = require("assert");

import { ConsoleInput, ConsoleOutput } from "../../../../console";
import { HttpServer } from "../../../../http/server";
import { HttpServeCommand } from "../../../../http/server/commands/HttpServeCommand";
import { Logger } from "../../../../core/logger";

function mock<T>(data: Object): T {
    return <T> data;
}

class StubConsoleOutput extends ConsoleOutput {

    public info(message: string): ConsoleOutput {
        return this;
    }

    public blank(): ConsoleOutput {
        return this;
    }

    public text(message: string): ConsoleOutput {
        return this;
    }

    public important(message: string): ConsoleOutput {
        return this;
    }

    public message(message: string): ConsoleOutput {
        return this;
    }

    public debug(message: string): ConsoleOutput {
        return this;
    }

    public error(message: string): ConsoleOutput {
        return this;
    }

    public warning(message: string): ConsoleOutput {
        return this;
    }
}

describe("guppy.http.server.commands.HttpServeCommand", () => {

    it("does not accept any arguments", () => {

        const httpServer = mock<HttpServer>({ });

        const httpServerCommand = new HttpServeCommand(
            httpServer,
            mock<Logger>({ info: () => {} })
        );

        assert.deepEqual(httpServerCommand.inputArguments(), []);
    });

    it("runs a server on default port", () => {

        let listeningPort: number = -1;

        const httpServer = mock<HttpServer>({ 
            listen(port: number) {
                listeningPort = port;
                return Promise.resolve();
            }
        });

        const output = new StubConsoleOutput();
        
        const input = new ConsoleInput(new Map(), new Map());

        const infoOutput: string[] = [];
        const httpServeCommand = new HttpServeCommand(
            httpServer,
            mock<Logger>({ info: (message: string) => infoOutput.push(message) })
        );

        return httpServeCommand
            .execute(input, output)
            .then(() => {
                assert.equal(listeningPort, 8082);
                assert.deepEqual(infoOutput, ["Server has been started on 8082 port."]);
            });
    });

    it("runs a server on passed port", () => {

        let listeningPort: number = -1;

        const httpServer = mock<HttpServer>({ 
            listen(port: number) {
                listeningPort = port;
                return Promise.resolve();
            }
        });

        const output = new StubConsoleOutput();

        const input = new ConsoleInput(new Map(), new Map());

        const infoOutput: string[] = [];
        const httpServerCommand = new HttpServeCommand(
            httpServer,
            mock<Logger>({ info: (message: string) => infoOutput.push(message) }),
            5000
        );

        return httpServerCommand
            .execute(input, output)
            .then(() => {
                assert.equal(listeningPort, 5000);
                assert.deepEqual(infoOutput, ["Server has been started on 5000 port."]);
            });
    });

    it("runs a server on custom port (CLI)", () => {

        let listeningPort: number = -1;

        const httpServer = mock<HttpServer>({ 
            listen(port: number) {
                listeningPort = port;
                return Promise.resolve();
            }
        });

        const output = new StubConsoleOutput();

        const inputOption = new Map();
        
        inputOption.set("port", 3032);

        const input = new ConsoleInput(inputOption, new Map());

        const infoOutput: string[] = [];
        const httpServerCommand = new HttpServeCommand(
            httpServer,
            mock<Logger>({ info: (message: string) => infoOutput.push(message) }),
            5000
        );

        return httpServerCommand
            .execute(input, output)
            .then(() => {
                assert.equal(listeningPort, 3032);
                assert.deepEqual(infoOutput, ["Server has been started on 3032 port."]);
            });
    });
});