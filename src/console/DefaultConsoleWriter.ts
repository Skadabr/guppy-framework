import { ConsoleWriter } from "./ConsoleWriter";

export class DefaultConsoleWriter extends ConsoleWriter {

    constructor(private _stdout: NodeJS.WritableStream) {
        super();
    }

    write(data: string): void {
        this._stdout.write(data);
    }

    writeLine(data: string): void {
        this.write(data + "\n");
    }
}