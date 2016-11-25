export type Constraint = (value: any) => any;
export type Violation = Error;

const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DATE_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

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

    public toInt(): Field {

        this._constraints.add((value: any) => {
            if (value) {
                if (typeof value !== "number") {
                    value = value.toString();

                    if (!value.match(/^\d+$/)) throw new Error(`Field "${this._fieldName}" must be an integer.`);

                    value = parseInt(value);
                }

                return value;
            }
        });

        return this;
    }

    public toDate(): Field {

        this._constraints.add((value: any) => {
            if (value) {
                if (!(value instanceof Date)) {
                    value = value.toString();
                    if (!value.match(DATE_PATTERN)) throw new Error(`Field "${this._fieldName}" must has ISO format.`);
                    value = new Date(value);
                }

                return value;
            }
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