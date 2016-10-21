import assert = require('assert');

import { MetadataRegistry } from "../../../core/MetadataRegistry";
import { Path } from "../../../http/annotations/Path";

describe('guppy.http.annotations.Path', () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("registers metadata for classes", () => {
        @Path('/users')
        class UserController { }

        assert.equal(
            true,
            MetadataRegistry
                .classesByMetadataKey("guppy.http.path")
                .has(UserController)
        );

        let classMetadata = MetadataRegistry
                .classesByMetadataKey("guppy.http.path")
                .get(UserController);

        assert.equal(classMetadata.length, 1);
        assert.equal(classMetadata[0]["path"], "/users");
    });

    it("does not registers metadata for classes", () => {
        
        class UserController { }

        assert.equal(
            false,
            MetadataRegistry
                .classesByMetadataKey('guppy.http.path')
                .has(UserController)
        );
    });

    it("does not support using with members", () => {

        assert.throws(
            () => {
                class UserController {
                    @Path('/users/{userId}')
                    public details(userId: number) { }
                }
            },
            "Annotation @Path doesn't support using with members"
        );
    });
});