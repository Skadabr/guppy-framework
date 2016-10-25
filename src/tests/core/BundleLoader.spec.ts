import { BundleLoader, Container, Bundle } from "../../core";

import assert = require("assert");

function mock<T>(data?: Object): T {
    return <T> (data || {});
}

describe("guppy.core.BundleLoader", () => {

    it("loads controllers for bundles", () => {
        const container = new Container();
        const bundleLoader = new BundleLoader(container);

        bundleLoader.load([
            mock<Bundle>({
                autoload: () => [`${__dirname}/_bundles`],
                config: () => {},
                services: () => {}
            })
        ]);
    });

});