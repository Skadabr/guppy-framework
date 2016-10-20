export class RequestContext {

    public constructor(
        private _controllerClass: Function,
        private _methodName: string
    ) {
    }

    get controllerClass(): Function {
        return this._controllerClass;
    }

    get methodName(): string {
        return this._methodName;
    }
}