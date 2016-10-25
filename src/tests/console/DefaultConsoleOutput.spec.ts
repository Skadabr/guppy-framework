import assert = require("assert");

import { DefaultConsoleOutput, ConsoleWriter } from "../../console";

class StubConsoleWriter extends ConsoleWriter {
    public buffer: string = "";
    
    public write(data: string): void {
        this.buffer += data;
    }

    public writeLine(data: string): void {
        this.buffer += data + "\n";
    }
}

describe("guppy.console.DefaultConsoleOutput", () => {

    it("prints a blank line", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.blank();

        assert.equal(consoleWriter.buffer, "\n");
    });

    it("prints a text", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.text("Text");

        assert.equal(consoleWriter.buffer, "Text\n");
    });

    it("prints an informational message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.info("Info");

        assert.equal(consoleWriter.buffer, "\u001b[36mInfo\u001b[39m\n");
    });

    it("prints an important message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.important("Important");

        assert.equal(consoleWriter.buffer, "\u001b[33mImportant\u001b[39m\n");
    });

    it("prints a message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.message("Message");

        assert.equal(consoleWriter.buffer, "\u001b[32mMessage\u001b[39m\n");
    });

    it("prints a debug message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.debug("Debug");

        assert.equal(consoleWriter.buffer, "\u001b[90mDebug\u001b[39m\n");
    });

    it("prints an error message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.error("Error");

        assert.equal(consoleWriter.buffer, "\u001b[31mError\u001b[39m\n");
    });

    it("prints a warning message", () => {
        const consoleWriter = new StubConsoleWriter();
        const consoleOutput = new DefaultConsoleOutput(consoleWriter);

        consoleOutput.warning("Warning");

        assert.equal(consoleWriter.buffer, "\u001b[31mWarning\u001b[39m\n");
    });
});