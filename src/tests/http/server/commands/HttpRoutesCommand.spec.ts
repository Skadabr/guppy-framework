import { Path, Post, Get } from "../../../../http/annotations";
import { HttpRoutesCommand } from "../../../../http/server/commands/HttpRoutesCommand";

import assert = require("assert");

import { ConsoleInput, ConsoleOutput } from "../../../../console";
import { RouteRegistry } from "../../../../http/server/RouteRegistry";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.http.server.commands.HttpRoutesCommand", () => {

    before(() => {
        RouteRegistry.prebootClear();
    });

    it("can be instantiated", () => {

        const routeRegistry = mock<RouteRegistry>();
        const httpRoutesCommand = new HttpRoutesCommand(routeRegistry);

        assert.ok(httpRoutesCommand instanceof HttpRoutesCommand);
    });

    it("does not accept any arguments", () => {
        const routeRegistry = mock<RouteRegistry>();
        const httpRoutesCommand = new HttpRoutesCommand(routeRegistry);
        
        assert.deepEqual(httpRoutesCommand.inputArguments(), []);
    });

    it("displays message that no registered routes", () => {
        const routeRegistry = mock<RouteRegistry>({
            all: () => []
        });
        const httpRoutesCommand = new HttpRoutesCommand(routeRegistry);
        
        let consoleOutputData = "";

        const consoleOutput = mock<ConsoleOutput>({
            
            text(message: string): ConsoleOutput {
                consoleOutputData += message;
                return consoleOutput;
            },

            blank(): ConsoleOutput {
                consoleOutputData += "\n";
                return consoleOutput;
            }
        });

        return httpRoutesCommand
            .execute(
                mock<ConsoleInput>({

                }),
                consoleOutput
            )
            .then(() => {
                assert.ok(consoleOutputData.indexOf("No registered routes.") > -1);
            });
    });

    it("displays all found routes from container", () => {

        class UserController {}

        const routeRegistry = mock<RouteRegistry>({
            all: () => [
                {
                    method: "POST",
                    route: "/users",
                    controllerClass: UserController,
                    handlerName: "register"
                }
            ]
        });

        const httpRoutesCommand = new HttpRoutesCommand(routeRegistry);
        
        let consoleOutputData = "";

        const consoleOutput = mock<ConsoleOutput>({
            
            text(message: string): ConsoleOutput {
                consoleOutputData += message;
                return consoleOutput;
            },

            blank(): ConsoleOutput {
                consoleOutputData += "\n";
                return consoleOutput;
            }
        });

        return httpRoutesCommand
            .execute(
                mock<ConsoleInput>({

                }),
                consoleOutput
            )
            .then(() => {
                consoleOutputData = consoleOutputData.replace(/\s+/g, " ");

                assert.ok(consoleOutputData.indexOf("Route list:") > -1);
                assert.ok(consoleOutputData.indexOf("POST /users UserController.register") > -1);
            });
    });
});