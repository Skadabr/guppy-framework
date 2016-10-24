import { Container, MetadataRegistry } from "../../../../core";
import { Path, Post, Get } from "../../../../http/annotations";
import { HttpRoutesCommand } from "../../../../http/server/commands/HttpRoutesCommand";

import assert = require("assert");

import { ConsoleInput, ConsoleOutput } from "../../../../console";
import { HttpServer, RouteLoader } from "../../../../http/server";

function mock<T>(data: Object): T {
    return <T> data;
}

describe("guppy.http.server.commands.HttpRoutesCommand", () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("can be instantiated", () => {
        const container = new Container();
        const httpRoutesCommand = new HttpRoutesCommand(container);

        assert.ok(httpRoutesCommand instanceof HttpRoutesCommand);
    });

    it("does not accept any arguments", () => {
        const container = new Container();
        const httpRoutesCommand = new HttpRoutesCommand(container);
        
        assert.deepEqual(httpRoutesCommand.inputArguments(), []);
    });

    it("displays message that no registered routes", () => {
        const container = new Container();
        const httpRoutesCommand = new HttpRoutesCommand(container);
        
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

        class UserController {
            @Post("/users")
            public register() { }
        }

        const container = new Container();
        const httpRoutesCommand = new HttpRoutesCommand(container);
        
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

    it("displays all found routes from container (with prefix)", () => {

        @Path("/tasks")
        class TaskController {
            @Post("/")
            public create() { }

            @Get("/new")
            public newTasks() { }
        }

        const container = new Container();
        const httpRoutesCommand = new HttpRoutesCommand(container);
        
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
                assert.ok(consoleOutputData.indexOf("POST /tasks TaskController.create") > -1);
                assert.ok(consoleOutputData.indexOf("GET /tasks/new TaskController.newTasks") > -1);
            });
    });
});