import { Bundle, ConfigState, Container } from "../core";

import { Presenter } from "./Presenter";
import { RootPresenter } from "./RootPresenter";

export class PresenterBundle extends Bundle {

    public name(): string {
        return "guppy.presenter";
    }

    public services(container: Container, config: ConfigState): void {
        container.bind(Presenter, RootPresenter);
    }
}