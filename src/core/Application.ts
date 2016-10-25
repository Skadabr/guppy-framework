import { Container } from "./Container";
import { Bundle } from "./Bundle";
import { BundleLoader } from "./BundleLoader";

export class Application {

    public constructor(
        private _bundles: Bundle[]
    ) {
    }

    private initializeContainer(): Container {

        const container = new Container();

        container.factory(BundleLoader, async () => new BundleLoader(
            await container.get(Container)
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