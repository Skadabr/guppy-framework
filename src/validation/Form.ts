import { MetadataRegistry } from "../core/MetadataRegistry";
import { Field } from "./Field";

export const FORM_METADATA_KEY = "guppy.validation.form";

export function Form(...fields: Field[]): Function {

    return (classDefinition, propertyName) => {

        classDefinition = classDefinition instanceof Function ? classDefinition : classDefinition.constructor;

        if (!propertyName) {
            throw new Error("Annotation @Form doesn't support using with classes");
        }

        MetadataRegistry.putForMember(
            classDefinition,
            propertyName,
            FORM_METADATA_KEY,
            fields
        );
    };
}