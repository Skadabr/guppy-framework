import { RouteRegistry } from "../server/RouteRegistry";

export function Route(method: string, route?: string): Function {

    return (classPrototype, memberName) => {

        if (!memberName) {
            throw new Error("Annotation doesn't support using with classes");
        }

        RouteRegistry.prebootRegister({
            method: method,
            route: route || "",
            controllerClass: classPrototype.constructor,
            handlerName: memberName
        });
    };
}