import { Request } from "../http/Request";
import { Field } from "./Field";
import { Middleware, RouteAction } from "../http/server";
import { Response } from "../http/Response";
import { ResponseStatus } from "../http/ResponseStatus";
import { OriginalAction } from "../http/server/MiddlewareRegistry";
import { FormConstraintsSet } from "./Form";

export class ValidationMiddleware implements Middleware {

    public handle(request: Request, next: RouteAction): Promise<Response> {

        const constraints: Field[] = next[OriginalAction][FormConstraintsSet];

        if (constraints !== void 0) {

            let violations: Error[] = [];

            for (const constraint of constraints) {
                try {
                    constraint.validate(request.body);
                } catch (error) {
                    violations.push(error);
                }
            }

            if (violations.length > 0) {
                return Promise.resolve(
                    Response.json(ResponseStatus.NotAcceptable, {
                        errorMessage: "Validation failed.",
                        children: violations.map(error => error.message)
                    })
                );
            }
        }

        return next(request);
    }
}