import { Bundle, ConfigState, Container } from "../core";

import { Presenter } from "./Presenter";
import { RootPresenter } from "./RootPresenter";

export class PresenterBundle extends Bundle {

    name(): string {
        return "guppy.presenter";
    }

    services(container: Container, config: ConfigState): void {
        container
            .factory(Presenter, () => new RootPresenter());
    }
}