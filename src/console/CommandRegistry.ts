export type CommandSet = { [commandName: string]: Function };

export class CommandRegistry {

    private commands: CommandSet = {};

    public register(commandName: string, commandClass: Function) {
        this.commands[commandName] = commandClass;
        return this;
    }

    public all(): CommandSet {
        return this.commands;
    }
}