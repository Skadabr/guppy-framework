import { Route } from "./Route";

export function Head(route?: string): Function {
    return Route("HEAD", route);
}