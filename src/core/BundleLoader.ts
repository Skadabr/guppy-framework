import { Container } from "./Container";
import { Bundle } from "./Bundle";

import { ConfigState, DefaultConfig } from "./Config";

export class BundleLoader {

    constructor(
        private _container: Container,
        private _glob
    ) {
    }

    async load(bundles: Bundle[]) {
        const configState = new ConfigState();
        const config = new DefaultConfig(configState);

        for (const bundle of bundles) bundle.config(config);

        for (const bundle of bundles) {
            await Promise.all(
                bundle
                    .autoload()
                    .map(annotatedDirectory => this.loadDirectory(annotatedDirectory))
            );

            bundle.services(this._container, configState);
        }
    }

    private async loadDirectory(directory: string) {
        return new Promise((resolve, reject) => {
            this._glob(
                `${directory}/*.js`,
                { },
                (error, files: string[]) => {
                    if (error) return reject(error);
                    resolve(
                        files
                            .map((filePath: string) => {
                                const controllerFile = require(filePath);

                                for (let exportName in controllerFile) {
                                    if (/Controller$/.exec(exportName)) return controllerFile[exportName];
                                }

                                return null;
                            })
                            .filter(controller => controller !== null)
                    );
                }
            );
        });
    }
}
