import assert = require("assert");

import { Container } from "../../core/Container";

describe("guppy.core.Container", () => {

    it("returns registered instances", () => {
        const container = new Container();

        container.service(Number, 1);

        const value = container.get(Number);
         
        assert.equal(value, 1);
    });

    it("instantiates classes without arguments", () => {

        class GreetingService {
            message(name: string) {
                return `Hello, ${name}!`;
            }
        }

        const container = new Container();

        const greetingService: GreetingService = container.get(GreetingService);

        assert.equal(greetingService.message("Alex"), "Hello, Alex!");
    });

    it("registers a service", () => {

        class GreetingService {
            message(name: string) {
                return `Hello, ${name}!`;
            }
        }

        class UserController {

            constructor(
                private greetingService: GreetingService
            ) {
            }

            hello(name: string): string {
                return this.greetingService.message(name);
            }
        }

        const container = new Container();

        container
            .service(UserController, [
                GreetingService
            ]);

        const userController: UserController = container.get(UserController);

        assert.equal(userController.hello("Alex"), "Hello, Alex!");
    });

    it("registers a factory", () => {

        class User {
            public constructor(public id: number) { }
        }

        class UserFactory {
            public counter: number = 0;
            public create() {
                return new User(++this.counter);
            }
        }

        const container = new Container();
        const userFactory = new UserFactory();

        container.factory(User, () => userFactory.create());

        container.get(User);
        container.get(User);
        container.get(User);

        assert.equal(userFactory.counter, 3);
    });

    it("returns a lazy-loaded instance", () => {
        const container = new Container();

        let counter = 2;

        container.service(Number, () => counter = 3);

        assert.equal(2, counter);
        assert.equal(3, container.get(Number));
        assert.equal(3, counter);
    });

    it("throws when service isn't registered", () => {

        const container = new Container();

        assert.throws(
            () => container.get(Number),
            /Service "Number" is not registered./
        );
    });

    it("extends an existent service", () => {

        class FirstService {

            public constructor(private _sum?: number) {
                this._sum = this._sum || 0;
            }

            public add(value: number) {
                this._sum += value;
            }

            public sum(): number {
                return this._sum;
            }
        }

        const container = new Container();

        container
            .service(
                FirstService,
                () => new FirstService(0)
            )
            .extend(
                FirstService,
                (firstService: FirstService) => firstService.add(2)
            )
            .extend(
                FirstService,
                (firstService: FirstService) => firstService.add(3)
            );

        const firstService = container.get(FirstService);

        assert.ok(firstService instanceof FirstService);
        assert.equal(firstService.sum(), 2 + 3);
    });

    it("throws on extending of non existent service", () => {

        class FirstService {

            public constructor(private _sum?: number) {
                this._sum = this._sum || 0;
            }

            public add(value: number) {
                this._sum += value;
            }

            public sum(): number {
                return this._sum;
            }
        }

        const container = new Container();

        assert.throws(
            () => container.extend(
                FirstService,
                (firstService: FirstService) => firstService.add(2)
            ),
            /ServiceNotRegistered: Service "FirstService" is not registered./
        );
    });
});