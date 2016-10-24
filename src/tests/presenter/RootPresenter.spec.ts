import assert = require('assert');

import { Presenter, RootPresenter } from "../../presenter";
import { User } from "./User";

class UserPresenter {
    public present(user: User) {
        return {
            id: user.id,
            name: user.name
        };
    }
}

describe("guppy.presenter.RootPresenter", () => {

    let rootPresenter: RootPresenter;

    before(() => {
        rootPresenter = new RootPresenter();
    })
        
    it("skip presentation when doesn't have a presenter", () => {

        assert.deepEqual(
            rootPresenter.present(new User(8, "John")),
            { _id: 8, _name: "John" }
        );
    });


    it("presents when has a presenter", () => {

        rootPresenter.register(User, new UserPresenter());

        assert.deepEqual(
            rootPresenter.present(new User(8, "John")),
            { id: 8, name: "John" }
        );
    });


    it("presents arrays", () => {

        rootPresenter.register(User, new UserPresenter());

        assert.deepEqual(
            rootPresenter.present([
                new User(8, "John"),
                new User(9, "Bill")
            ]),
            [
                { id: 8, name: "John" },
                { id: 9, name: "Bill" }
            ]
        );
    });


    it("presents hashes", () => {

        rootPresenter.register(User, new UserPresenter());

        assert.deepEqual(
            rootPresenter.present({
                first: new User(8, "John"),
                second: new User(9, "Bill")
            }),
            {
                first: { id: 8, name: "John" },
                second: { id: 9, name: "Bill" }
            }
        );
    });
});
