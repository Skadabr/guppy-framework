import test from "ava";

import { Presenter } from "../../presenter/Presenter";
import { RootPresenter } from "../../presenter/RootPresenter";
import { User } from "./User";

class UserPresenter {
    public present(user: User) {
        return {
            id: user.id,
            name: user.name
        };
    }
}

test("skip presentation when doesn't have a presenter", (t) => {

    const rootPresenter = new RootPresenter();

    t.deepEqual(
        rootPresenter.present(new User(8, "John")),
        { _id: 8, _name: "John" }
    );
});

test("presents when has a presenter", (t) => {

    const rootPresenter = new RootPresenter();

    rootPresenter.register(User, new UserPresenter());

    t.deepEqual(
        rootPresenter.present(new User(8, "John")),
        { id: 8, name: "John" }
    );
});

test("presents arrays", (t) => {

    const rootPresenter = new RootPresenter();

    rootPresenter.register(User, new UserPresenter());

    t.deepEqual(
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

test("presents hashes", (t) => {

    const rootPresenter = new RootPresenter();

    rootPresenter.register(User, new UserPresenter());

    t.deepEqual(
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