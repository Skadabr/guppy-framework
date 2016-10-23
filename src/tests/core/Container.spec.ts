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
});