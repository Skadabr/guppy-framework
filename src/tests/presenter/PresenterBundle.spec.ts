import assert = require('assert');

import { PresenterBundle, RootPresenter, Presenter } from "../../presenter";
import { Config, DefaultConfig, ConfigState, Container }  from "../../core";

describe("guppy.presenter.PresenterBundle", () => {

    let presenterBundle: PresenterBundle;

    before(() => {
        presenterBundle = new PresenterBundle();
    })

    it("return a name", () => {
        assert.equal(presenterBundle.name(), "guppy.presenter");
    });

    it("doesn't have autoload data", () => {
        assert.deepEqual(presenterBundle.autoload(), []);
    });

    it("configures application config", () => {
        let config = new DefaultConfig(
            new ConfigState()
        );

        presenterBundle.config(config);
    });

    it("registers a Presenter service", () => {
        const configState = new ConfigState();
        const container = new Container();

        presenterBundle.services(container, configState);

        return container
            .get(Presenter)
            .then((presenter: Presenter) => {
                assert.ok(presenter instanceof RootPresenter);
                assert.ok(presenter instanceof Presenter);
            });
    });

    it("registers a Presenter service with custom presenters", () => {

        class User { 
            constructor(
                public id: number, 
                public name: string
            ) {
            }
        }

        class UserPresenter extends Presenter {
            present(user: User): string {
                return JSON.stringify({
                    id: user.id,
                    fullName: user.name
                });
            }
        }

        const configState = new ConfigState();
        const container = new Container();

        container.factory(
            UserPresenter, 
            () => new UserPresenter(),
            { "guppy.presenter": User }
        );

        presenterBundle.services(container, configState);

        return container
            .get(Presenter)
            .then((presenter: Presenter) => {
                assert.equal(
                    presenter.present(new User(8, "Alex")), 
                    JSON.stringify({ id: 8, fullName: "Alex" })
                );
            });
    });
});
