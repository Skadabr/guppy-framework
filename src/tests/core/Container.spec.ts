import assert = require("assert");

import { ServiceNotRegistered } from "../../core/ServiceNotRegistered";
import { Container } from "../../core/Container";

describe("guppy.core.Container", () => {

    it("returns registered instances", () => {
        const container = new Container();

        container.instance(Number, 1);

        const value = container.get(Number);
         
        assert.equal(1, value);
    });

    it("returns a lazy-loaded instance", () => {
        const container = new Container();

        let counter = 2;

        container.factory(Number, () => counter = 3);

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
            .factory(
                FirstService,
                () => new FirstService()
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