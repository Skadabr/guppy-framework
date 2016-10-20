export class ValidationError extends Error {

    constructor(
        private _violations: Error[]
    ) {
        super("Validation failed.");
        this.name = "ValidationError";
    }

    get violations(): Error[] {
        return this._violations;
    }
}