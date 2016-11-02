export abstract class Config {
    public abstract section(sectionName: string): ConfigSection;
}

export type ConfigValue = any;

export abstract class ConfigSection {
    public abstract set(parameterName: string, value: ConfigValue): ConfigSection;
    public abstract setFromEnvironment(parameterName: string, environmentVariableName: string, defaultValue?: any): ConfigSection;
    public abstract end(): Config;
}

export class ConfigState {

    private _parameters: Map<string, string | number | boolean> = new Map();

    public set(parameterName: string, value: string | number | boolean): void {
        this._parameters.set(parameterName, value);
    }

    public get(parameterName: string): string | number | boolean | number {
        return this._parameters.get(parameterName) || null;
    }

    public has(parameterName: string): boolean {
        return this._parameters.has(parameterName);
    }
}

export class DefaultConfig implements Config {

    public constructor(
        private _state: ConfigState
    ) {
    }

    section(sectionName: string): ConfigSection {
        return new DefaultConfigSection(this._state, sectionName, this);
    }
}

export class DefaultConfigSection implements ConfigSection {

    public constructor(
        private _state: ConfigState,
        private _prefix: string,
        private _parent: Config
    ) {
    }

    set(parameterName: string, value: string | number | boolean): ConfigSection {
        this._state.set(this._prefix + "." + parameterName, value);
        return this;
    }

    setFromEnvironment(parameterName: string, environmentVariableName: string, defaultValue?: any): ConfigSection {
        this._state.set(
            this._prefix + "." + parameterName,
            process.env[environmentVariableName] || defaultValue
        );

        return this;
    }

    end(): Config {
        return this._parent;
    }
}