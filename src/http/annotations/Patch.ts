import { Route } from "./Route";

export function Patch(route?: string): Function {
    return Route("PATCH", route);
}