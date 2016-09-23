import test from "ava";

import { MetadataRegistry } from "../../../core/MetadataRegistry";
import { Get } from "../../../http/annotations/Get";

test("does not support using with members", (t) => {

    MetadataRegistry.clear();

    t.throws(
        () => {
            @Get("/users")
            class UserController { }      
        },
        "Annotation doesn't support using with classes"
    );
});

test("does not registers metadata for classes", (t) => {

    MetadataRegistry.clear();

    class UserController {}

    t.false(
        MetadataRegistry
            .classesByMetadataKey("guppy.http.route")
            .has(UserController)
    );
});

test('registers metadata for members', (t) => {

    MetadataRegistry.clear();

    class UserController {
        @Get('/users/{userId}')
        public details(userId: number) { }
    }

    let memberMetadata = <Array<Object>> MetadataRegistry
        .membersByMetadataKey("guppy.http.route")
        .values()
        .next()
        .value;

    t.is(memberMetadata.length, 1);
    t.is(memberMetadata[0]["method"], "GET");
    t.is(memberMetadata[0]["route"], "/users/{userId}");
});