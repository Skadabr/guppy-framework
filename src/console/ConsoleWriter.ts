export abstract class ConsoleWriter {
    public abstract write(data: string): void;
    public abstract writeLine(data: string): void;
}