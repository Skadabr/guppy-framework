export type OptionValue = string | number | boolean;
export type ArgumentValue = string | number | boolean;

export class ConsoleInput {

    public constructor(
        private _options: Map<string, OptionValue>,
        private _arguments: Map<string, ArgumentValue>
    ) {
    }

    hasOption(optionName: string): boolean {
        return this._options.has(optionName);
    }

    option(optionName: string): OptionValue | null {
        return this._options.get(optionName);
    }

    optionAsInt(optionName: string): number | null {
        return this._options.has(optionName)
            ? Number(this._options.get(optionName))
            : null;
    }

    hasArgument(argumentName: string): boolean {
        return this._arguments.has(argumentName);
    }

    argument(argumentName: string): ArgumentValue | null {
        return this._arguments.get(argumentName);
    }
}