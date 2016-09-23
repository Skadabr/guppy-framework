import { ConsoleInput }     from "./ConsoleInput";
import { ConsoleOutput }    from "./ConsoleOutput";

export abstract class Command {
    public abstract inputArguments(): string[];
    public abstract execute(input: ConsoleInput, output: ConsoleOutput): void;
}