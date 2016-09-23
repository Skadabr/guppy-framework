import { ArgumentValue, OptionValue, ConsoleInput } from "./ConsoleInput";
import { Command } from "./Command";

export const OPTION_PATTERN = /^-+([^=]+)(?:=(.*))?$/;

export class ConsoleInputProcessor {

    public process(rawInput: string[], command: Command): ConsoleInput {

        let optionList: Map<string, OptionValue> = ConsoleInputProcessor.readOptions(rawInput);
        let argumentList: Map<string, ArgumentValue> = ConsoleInputProcessor.readArguments(optionList.size, rawInput, command);

        return new ConsoleInput(optionList, argumentList);
    }

    private static readOptions(rawInput: string[]): Map<string, OptionValue> {
        let result: Map<string, OptionValue> = new Map<string, OptionValue>();

        let index: number = 0;
        let matching: Array<string> | null;

        while (index < rawInput.length) {
            matching = OPTION_PATTERN.exec(rawInput[index++]);

            if (!matching) break;

            result.set(matching[1], matching[2] || true);
        }

        return result;
    }

    private static readArguments(optionsCount: number, rawInput: string[], command: Command): Map<string, ArgumentValue> {
        let result: Map<string, ArgumentValue> = new Map<string, ArgumentValue>();

        let inputArguments: Array<string> = command.inputArguments();
        let givenArguments: number = rawInput.length - optionsCount;

        if (inputArguments.length < givenArguments) {
            throw new Error(`The command accepts only ${inputArguments.length} arguments. Given ${givenArguments} arguments.`);
        }

        let index: number = optionsCount;
        while (index < rawInput.length) {
            result.set(inputArguments[index - optionsCount], rawInput[index]);
            index++;
        }

        return result;
    }
}