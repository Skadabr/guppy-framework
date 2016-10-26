import { ConsoleOutput } from "./ConsoleOutput";
import { ConsoleWriter } from "./ConsoleWriter";

import * as colors from "colors";

export class DefaultConsoleOutput extends ConsoleOutput {

    constructor(private writer: ConsoleWriter) {
        super();
    }

    blank(): ConsoleOutput {
        this.writer.writeLine("");
        return this;
    }

    text(message: string): ConsoleOutput {
        this.writer.writeLine(message);
        return this;
    }

    info(message: string): ConsoleOutput {
        this.writer.writeLine(colors.cyan(message));
        return this;
    }

    important(message: string): ConsoleOutput {
        this.writer.writeLine(colors.yellow(message));
        return this;
    }

    message(message: string): ConsoleOutput {
        this.writer.writeLine(colors.green(message));
        return this;
    }

    debug(message: string): ConsoleOutput {
        this.writer.writeLine(colors.gray(message));
        return this;
    }

    error(message: string): ConsoleOutput {
        this.writer.writeLine(colors.red(message));
        return this;
    }

    warning(message: string): ConsoleOutput {
        this.writer.writeLine(colors.red(message));
        return this;
    }
}