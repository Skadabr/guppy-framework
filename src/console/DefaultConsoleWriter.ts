import { ConsoleWriter } from "./ConsoleWriter";

export class DefaultConsoleWriter implements ConsoleWriter {

    write(data: string): void {
        process.stdout.write(data);
    }

    writeLine(data: string): void {
        this.write(data + "\n");
    }
}