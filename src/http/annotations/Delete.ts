import { Route } from "./Route";

export function Delete(route?: string): Function {
    return Route("DELETE", route);
}