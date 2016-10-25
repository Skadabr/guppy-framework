import { DefaultConsoleWriter } from "../../console";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.DefaultConsoleWriter", () => {

    it("writes to stdout", () => {
        let stdoutData = "";

        const consoleWriter = new DefaultConsoleWriter(
            mock<NodeJS.WritableStream>({
                write(data: string) {
                    stdoutData += data;
                }
            })
        );

        consoleWriter.writeLine("First Line");
        consoleWriter.writeLine("Second Line");
        consoleWriter.write("Third Line");

        assert.equal(stdoutData, "First Line\nSecond Line\nThird Line");
    });
});