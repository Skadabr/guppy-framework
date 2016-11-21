import assert = require("assert");

import { Container, Bundle } from "../../core";
import { ConsoleApplication, ConsoleWriter, DefaultConsoleWriter } from "../../console";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.ConsoleApplication", () => {

    it("runs a console application", () => {

        let stdoutData = "";

        const consoleWriter = new DefaultConsoleWriter(
            mock<NodeJS.WritableStream>({
                write(data: string) {
                    stdoutData += data;
                }
            })
        );

        const consoleApplication = new ConsoleApplication([
            mock<Bundle>({
                autoload: () => [],
                config: () => {},
                developmentConfig: () => {},
                services: (container: Container) => container.instance(ConsoleWriter, consoleWriter),
                developmentServices: () => {}
            })
        ]);

        return consoleApplication.run(["myScript.js", "help"])
            .then((container: Container) => {
                assert.ok(stdoutData.indexOf("Guppy Console") > -1);
                assert.ok(stdoutData.indexOf("Usage:") > -1);
                assert.ok(stdoutData.indexOf("command [options] [arguments]") > -1);
                assert.ok(stdoutData.indexOf("Available commands:") > -1);
                assert.ok(stdoutData.indexOf("help") > -1);
            });
    });

});