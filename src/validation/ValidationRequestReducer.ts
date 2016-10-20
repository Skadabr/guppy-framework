import { RequestReducer } from "../http/server/ReducerRegistry";
import { Request } from "../http/Request";
import { RequestContext } from "../http/server/RequestContext";
import { ValidationError } from "./ValidationError";
import { MetadataRegistry } from "../core/MetadataRegistry";
import { FORM_METADATA_KEY } from "./Form";
import { Field } from "./Field";

export class ValidationRequestReducer implements RequestReducer {
    
    async modify(request: Request, requestContext: RequestContext): Promise<Request> {
        
        const memberMetadata = MetadataRegistry.memberMetadata(
            FORM_METADATA_KEY,
            requestContext.controllerClass,
            requestContext.methodName
        );

        if (memberMetadata) {
            const validationRules = <Field[]> memberMetadata[0];

            let violations: Error[] = [];

            for (const constraint of validationRules) {
                try {
                    constraint.validate(request.body);
                } catch (error) {
                    violations.push(error);
                }
            }

            if (violations.length > 0) {
                throw new ValidationError(violations);
            }
        }

        return request;
    }
}