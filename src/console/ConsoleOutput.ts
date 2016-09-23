export abstract class ConsoleOutput {
    public abstract blank(): ConsoleOutput;
    public abstract text(message: string): ConsoleOutput;
    public abstract info(message: string): ConsoleOutput;
    public abstract important(message: string): ConsoleOutput;
    public abstract message(message: string): ConsoleOutput;
    public abstract debug(message: string): ConsoleOutput;
    public abstract error(message: string): ConsoleOutput;
    public abstract warning(message: string): ConsoleOutput;
}