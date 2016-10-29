export interface RawRoute {
    method: string;
    route: string;
    controllerClass: Function;
    handlerName: string;
}

export class RouteRegistry {

    private static prebootRawRoutes: RawRoute[] = [];

    public static prebootClear() {
        RouteRegistry.prebootRawRoutes.length = 0;
    }

    public static prebootRegister(rawRoute: RawRoute) {
        RouteRegistry.prebootRawRoutes.push(rawRoute);
    }

    private rawRoutes: RawRoute[] = [];

    public constructor(ignorePrebootData?: boolean) {
        if (!ignorePrebootData) {
            this.rawRoutes = this.rawRoutes.concat(RouteRegistry.prebootRawRoutes);
        }
    }

    public all(): RawRoute[] {
        return this.rawRoutes;
    }
}