export function Path(route: string): Function {
    return (targetClass, propertyName) => {

        if (propertyName) {
            throw new Error("Annotation @Path doesn't support using with members");
        }

        targetClass["routePrefix"] = route;
    };
}