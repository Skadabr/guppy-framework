import { Presenter } from "./Presenter";

export class RootPresenter extends Presenter {

    private _presenters: Map<Function, Presenter> = new Map();

    public register(subject: Function, presenter: Presenter) {
        this._presenters.set(subject, presenter);
    }

    public present(data: any): any {

        if (typeof data["constructor"] !== "function") return data;

        if (data.constructor.name === "Array") {
            const result = [];

            for (const elementIndex in data) {
                result.push(
                    this.present(data[elementIndex])
                );
            }

            return result;
        }

        if (data.constructor.name === "Object") {
            const result = {};

            for (const elementIndex in data) {
                result[elementIndex] = this.present(data[elementIndex]);
            }

            return result;
        }

        if (this._presenters.has(data.constructor)) {
            return this._presenters.get(data.constructor).present(data);
        }

        return data;
    }
}