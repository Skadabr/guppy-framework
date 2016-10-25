import assert = require("assert");

import { BundleLoader, Container, Bundle } from "../../core";

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.core.BundleLoader", () => {

    it("loads controllers for bundles", () => {
        const container = new Container();
        const bundleLoader = new BundleLoader(container, (pattern, options, callback) => {
            assert.equal(pattern, `${__dirname}/_bundles/*.js`);
            callback(null, [
                `${__dirname}/_bundles/TestController`,
                `${__dirname}/_bundles/IgnoredService`,
            ]);
        });

        return bundleLoader.load([
            mock<Bundle>({
                autoload: () => [`${__dirname}/_bundles`],
                config: () => {},
                services: () => {}
            })
        ]);
    });

    it("returns error when it cannot read autoload data", () => {

        const container = new Container();
        const bundleLoader = new BundleLoader(container, (pattern, options, callback) => {
            assert.equal(pattern, `${__dirname}/_bundles/*.js`);
            callback(new Error("Cannot read data."));
        });

        return bundleLoader
            .load([
                mock<Bundle>({
                    autoload: () => [`${__dirname}/_bundles`],
                    config: () => {},
                    services: () => {}
                })
            ])
            .catch(error => error)
            .then((error: Error) => {
                assert.ok(error instanceof Error);
                assert.equal(error.message, "Cannot read data.");
            });
    });

});