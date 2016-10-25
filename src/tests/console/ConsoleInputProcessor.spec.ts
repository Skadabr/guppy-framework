import assert = require("assert");

import { ConsoleInputProcessor, Command, ConsoleInput } from "../../console";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.console.ConsoleInputProcessor", () => {

    it("accepts CLI input without any data", () => {
        const consoleInputProcessor = new ConsoleInputProcessor();

        const consoleInput = consoleInputProcessor.process(
            [],
            mock<Command>({
                inputArguments: () => []
            })
        );

        assert.ok(consoleInput instanceof ConsoleInput);
    });

    it("parses options from CLI input", () => {
        const consoleInputProcessor = new ConsoleInputProcessor();

        const consoleInput = consoleInputProcessor.process(
            ["--port=3029", "--priority=HIGH"],
            mock<Command>({
                inputArguments: () => []
            })
        );
        
        assert.ok(consoleInput.hasOption('port'));
        assert.deepEqual(consoleInput.optionAsInt('port'), 3029);
        assert.ok(consoleInput.hasOption('priority'));
        assert.deepEqual(consoleInput.option('priority'), 'HIGH');
        assert.equal(consoleInput.hasOption('not-exist-options'), false);
    });

    it("parses arguments from CLI input", () => {
        const consoleInputProcessor = new ConsoleInputProcessor();

        const consoleInput = consoleInputProcessor.process(
            ["--port=80", "/var/www/html"],
            mock<Command>({
                inputArguments: () => ["documentRoot"]
            })
        );
        
        assert.ok(consoleInput.hasOption('port'));
        assert.deepEqual(consoleInput.optionAsInt('port'), 80);
        assert.ok(consoleInput.hasArgument('documentRoot'));
        assert.equal(consoleInput.argument('documentRoot'), "/var/www/html");
    });

    it("throws an error when more arguments then expected", () => {
        const consoleInputProcessor = new ConsoleInputProcessor();

        assert.throws(
            () => consoleInputProcessor.process(
                ["/var/www/html"],
                mock<Command>({
                    inputArguments: () => []
                })
            ),
            /The command accepts only 0 arguments. Given 1 arguments./
        );
    });

});