import { MetadataRegistry } from "../../core/MetadataRegistry";

export const PATH_METADATA_KEY = "guppy.http.path";

export function Path(route: string): Function {
    return (classSubject, memberName) => {

        if (memberName) {
            throw new Error("Annotation @Path doesn't support using with members");
        }

        const classDefinition: Function = classSubject instanceof Function
            ? classSubject
            : classSubject.constructor;

        MetadataRegistry.putForClass(classDefinition, PATH_METADATA_KEY, { path: route });
    };
}