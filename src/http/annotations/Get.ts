import { Route } from "./Route";

export function Get(route?: string): Function {
    return Route("GET", route);
}