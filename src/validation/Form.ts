import { Field } from "./Field";

export const FormConstraintsSet = Symbol("validation.constraints");

export function Form(...fields: Field[]): Function {

    return (classDefinition, propertyName) => {

        if (!propertyName) {
            throw new Error("Annotation @Form doesn't support using with classes.");
        }

        classDefinition[propertyName][FormConstraintsSet] = fields;
    };
}