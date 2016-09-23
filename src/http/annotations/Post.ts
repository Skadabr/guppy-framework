import { Route } from "./Route";

export function Post(route?: string): Function {
    return Route("POST", route);
}