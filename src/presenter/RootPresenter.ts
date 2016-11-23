import { Presenter } from "./Presenter";

export class RootPresenter extends Presenter {

    private _presenters: Map<Function, Presenter> = new Map();

    public register(subject: Function, presenter: Presenter) {
        this._presenters.set(subject, presenter);
    }

    public present(data: any): any {

        if (data == null) return null;

        let result;

        switch (data.constructor.name) {

            case "Array":
                result = [];

                for (const elementIndex in data) {
                    result.push(
                        this.present(data[elementIndex])
                    );
                }

                break;

            case "Object":
                result = {};

                for (const elementIndex in data) {
                    result[elementIndex] = this.present(data[elementIndex]);
                }

                break;

            default:
                result = this._presenters.has(data.constructor)
                    ? this._presenters.get(data.constructor).present(data)
                    : data;

                break;
        }

        return result;
    }
}