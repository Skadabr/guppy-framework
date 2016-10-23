export type Metadata = Object;

export interface Member {
    classDefinition: Function;
    name: string;
}

export class MetadataRegistry {

    public static clear() {
        this._classesMetadata.clear();
        this._membersMetadata.clear();
        this._metadataForClasses.clear();
        this._metadataForMembers.clear();
    }

    // ===

    private static _classesMetadata: Map<Function, string[]> = new Map();
    private static _membersMetadata: Map<Function, Map<string, string[]>> = new Map();
    private static _metadataForClasses: Map<string, Map<Function, Array<Object>>> = new Map();
    private static _metadataForMembers: Map<string, Map<Function, Map<string, Array<Object>>>> = new Map();

    // ===

    public static putForClass(classDefinition: Function, metadataKey: string, metadata: Metadata) {
        if (!this._classesMetadata.has(classDefinition)) this._classesMetadata.set(classDefinition, []);
        if (!this._metadataForClasses.has(metadataKey)) this._metadataForClasses.set(metadataKey, new Map());
        if (!this._metadataForClasses.get(metadataKey).has(classDefinition)) {
            this._metadataForClasses.get(metadataKey).set(classDefinition, []);
        }

        this._metadataForClasses.get(metadataKey).get(classDefinition).push(metadata);

        if (this._classesMetadata.get(classDefinition).indexOf(metadataKey) === -1) {
            this._classesMetadata.get(classDefinition).push(metadataKey);
        }
    }

    public static classesByMetadataKey(metadataKey: string): Map<Function, Object[]> {
        return this._metadataForClasses.has(metadataKey)
            ? this._metadataForClasses.get(metadataKey)
            : new Map();
    }

    public static memberMetadata(metadataKey: string, classDefinition: Function, memberName: string): Object[] {
        if (!this._metadataForMembers.has(metadataKey)) return null;
        if (!this._metadataForMembers.get(metadataKey).has(classDefinition)) return null;
        if (!this._metadataForMembers.get(metadataKey).get(classDefinition).has(memberName)) return null;

        return this._metadataForMembers.get(metadataKey).get(classDefinition).get(memberName);
    }

    public static putForMember(classDefinition: Function, memberName: string, metadataKey: string, metadata: Metadata) {
        if (!this._membersMetadata.has(classDefinition)) this._membersMetadata.set(classDefinition, new Map());
        if (!this._membersMetadata.get(classDefinition).has(memberName)) this._membersMetadata.get(classDefinition).set(memberName, []);
        if (this._membersMetadata.get(classDefinition).get(memberName).indexOf(metadataKey) === -1) {
            this._membersMetadata.get(classDefinition).get(memberName).push(metadataKey);
        }

        if (!this._metadataForMembers.has(metadataKey)) {
            this._metadataForMembers.set(metadataKey, new Map());
        }

        if (!this._metadataForMembers.get(metadataKey).has(classDefinition)) {
            this._metadataForMembers.get(metadataKey).set(classDefinition, new Map());
        }

        if (!this._metadataForMembers.get(metadataKey).get(classDefinition).has(memberName)) {
            this._metadataForMembers.get(metadataKey).get(classDefinition).set(memberName, []);
        }

        this._metadataForMembers.get(metadataKey).get(classDefinition).get(memberName).push(metadata);
    }

    public static membersByMetadataKey(metadataKey: string): Map<Member, Object[]> {
        let result: Map<Member, Object[]> = new Map();

        if (!this._metadataForMembers.has(metadataKey)) return result;

        for (const classDefinition of this._metadataForMembers.get(metadataKey).keys()) {
            for (const methodName of this._metadataForMembers.get(metadataKey).get(classDefinition).keys()) {
                result.set(
                    { classDefinition: classDefinition, name: methodName },
                    this._metadataForMembers.get(metadataKey).get(classDefinition).get(methodName)
                );
            }
        }

        return result;
    }
}