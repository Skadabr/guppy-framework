import { Bundle }               from "../core/Bundle";
import { Config, ConfigState }  from "../core/Config";
import { Container }            from "../core/Container";

import { Presenter } from "./Presenter";
import { RootPresenter } from "./RootPresenter";

export const PRESENTER_TAG = "guppy.presenter";

export class PresenterBundle extends Bundle {

    name(): string {
        return "guppy.presenter";
    }

    autoload(): string[] {
        return [];
    }

    config(config: Config): void {

    }

    services(container: Container, config: ConfigState): void {
        container
            .factory(
                Presenter,
                async () => {
                    const rootPresenter = new RootPresenter();

                    for (const serviceDefinition of container.byTag(PRESENTER_TAG)) {
                        rootPresenter.register(
                            serviceDefinition.tags()[PRESENTER_TAG],
                            <Presenter> await serviceDefinition.instance()
                        );
                    }

                    return rootPresenter;
                }
            );
    }
}