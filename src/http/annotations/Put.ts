import { Route } from "./Route";

export function Put(route?: string): Function {
    return Route("PUT", route);
}