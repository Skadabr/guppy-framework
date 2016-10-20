export type Constraint = (value: any) => any;
export type Violation = Error;

const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Field {

    private _constraints: Set<Constraint> = new Set();

    public constructor(
        private _fieldName: string
    ) {
    }

    public trim(): Field {

        this._constraints.add((value: any) => {
            if (typeof value === "undefined") return;

            return value.toString().trim();
        });

        return this;
    }

    public isString(): Field {

        this._constraints.add((value: any): void => {
            if (typeof value === "undefined") return;
            if (typeof value !== "string") throw new Error(`Field "${this._fieldName}" must be a string.`);
        });

        return this;
    }

    public required(): Field {

        this._constraints.add((value: any): void => {
            if (typeof value === "undefined") throw new Error(`Field "${this._fieldName}" is required.`);
        });

        return this;
    }

    public isEmail(): Field {

        this._constraints.add((value: any): void => {
            if (typeof value === "undefined") return;
            if (!EMAIL_PATTERN.test(value)) throw new Error(`Field "${this._fieldName}" must be an email.`);
        });

        return this;
    }

    public validate(value: any) {

        for (const constraint of this._constraints.values()) {
            let result = constraint(value[this._fieldName]);

            if (result !== undefined) {
                value[this._fieldName] = result;
            }
        }
    }
}

export function field(name: string): Field {
    return new Field(name);
}