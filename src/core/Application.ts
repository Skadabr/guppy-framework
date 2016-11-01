import { Container } from "./Container";
import { Bundle } from "./Bundle";
import { BundleLoader } from "./BundleLoader";
import { Logger, LoggerFactory, Log4jsLoggerFactory } from "../logging";
import * as glob from "glob";

export class Application {

    public constructor(
        private _bundles: Bundle[]
    ) {
    }

    private initializeContainer(): Container {

        const container = new Container();

        container.factory(LoggerFactory, () => new Log4jsLoggerFactory());
        container.factory(Logger, async () => (await container.get(LoggerFactory)).createLogger());
        container.factory(BundleLoader, async () => new BundleLoader(
            await container.get(Container),
            glob
        ));

        return container;
    }

    public async run(argv: string[]): Promise<Container> {

        const container = this.initializeContainer();

        const bundleLoader = await container.get(BundleLoader);
        await bundleLoader.load(this._bundles);

        return container;
    }
}