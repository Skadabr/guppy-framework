import { RouteRegistry } from "../server/RouteRegistry";

export const ROUTE_METADATA_KEY = "guppy.http.route";

export function Route(method: string, route?: string): Function {

    return (classSubject, memberName) => {

        if (!memberName) {
            throw new Error("Annotation doesn't support using with classes");
        }

        const classDefinition: Function = classSubject instanceof Function
            ? classSubject
            : classSubject.constructor;

        RouteRegistry.prebootRegister({
            method: method,
            route: route || "",
            controllerClass: classDefinition,
            handlerName: memberName
        });
    };
}