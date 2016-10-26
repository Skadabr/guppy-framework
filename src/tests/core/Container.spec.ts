import assert = require("assert");

import { ServiceNotRegistered } from "../../core/ServiceNotRegistered";
import { Container } from "../../core/Container";

describe("guppy.core.Container", () => {

    it("returns registered instances", async () => {
        const container = new Container();

        let counter = 0;

        container.instance(Number, 1);

        const value = await container.get(Number);
         
        assert.equal(1, value);
    });

    it("returns a lazy-loaded instance", async () => {
        const container = new Container();

        let counter = 2;

        container.factory(Number, () => counter = 3);

        assert.equal(2, counter);
        assert.equal(3, await container.get(Number));
        assert.equal(3, counter);
    });

    it("throws when service isn't registered", (done) => {

        const container = new Container();

        container
            .get(Number)
            .catch((service: ServiceNotRegistered) => {
                assert.equal(service.message, 'Service "Number" is not registered.');
                done();
            });
    });

    it("return services by tag", (done) => {

        class FirstService { }
        class SecondService { }
        class ThirdService { }

        const container = new Container();

        container.factory(FirstService, () => new FirstService(), { odd: true });
        container.factory(SecondService, () => new SecondService(), { even: true });
        container.factory(ThirdService, () => new ThirdService(), { odd: true });

        Promise
            .all(
                container
                    .byTag('odd')
                    .map(serviceDefinition => serviceDefinition.instance())
            )
            .then((services: Object[]) => {
                assert.ok(services[0] instanceof FirstService);
                assert.ok(services[1] instanceof ThirdService);
                done();
            });
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

        container.factory(FirstService, () => new FirstService());

        container.extend(FirstService, (firstService: FirstService) => {
            firstService.add(2);
            return firstService;
        });

        container.extend(FirstService, (firstService: FirstService) => {
            firstService.add(3);
            return firstService;
        });

        return container.get(FirstService)
            .then((firstService: FirstService) => {
                assert.ok(firstService instanceof FirstService);
                assert.equal(firstService.sum(), 2 + 3);
            });
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
            () => container.extend(FirstService, (firstService: FirstService) => {
                firstService.add(2);
                return firstService;
            }),
            /ServiceNotRegistered: Service "FirstService" is not registered./
        );
    });
});