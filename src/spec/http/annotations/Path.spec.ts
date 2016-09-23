import test from "ava";

import { MetadataRegistry } from "../../../core/MetadataRegistry";
import { Path } from "../../../http/annotations/Path";

test('registers metadata for classes', (t) => {

    MetadataRegistry.clear();

    @Path('/users')
    class UserController { }

    t.true(
        MetadataRegistry
            .classesByMetadataKey('guppy.http.path')
            .has(UserController)
    );

    let classMetadata = MetadataRegistry
        .classesByMetadataKey('guppy.http.path')
        .get(UserController);

    t.is(classMetadata.length, 1);
    t.is(classMetadata[0]['path'], '/users');
});

test('does not registers metadata for classes', (t) => {

    MetadataRegistry.clear();

    class UserController { }

    t.false(
        MetadataRegistry
            .classesByMetadataKey('guppy.http.path')
            .has(UserController)
    );
});

test('does not support using with members', (t) => {

    MetadataRegistry.clear();

    t.throws(
        () => {
            class UserController {
                @Path('/users/{userId}')
                public details(userId: number) { }
            }
        },
        "Annotation @Path doesn't support using with members"
    );
});