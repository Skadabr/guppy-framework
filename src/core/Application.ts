import { Container } from "./Container";
import { Bundle } from "./Bundle";
import { BundleLoader } from "./BundleLoader";
import { CoreBundle } from "./CoreBundle";

import * as glob from "glob";

export class Application {

    public constructor(
        private _bundles: Bundle[]
    ) {
        this._bundles = [ new CoreBundle() ].concat(_bundles);
    }

    public async run(argv: string[]): Promise<Container> {

        const container = new Container();
        const bundleLoader = new BundleLoader(container, glob);

        await bundleLoader.load(this._bundles);

        return container;
    }
}