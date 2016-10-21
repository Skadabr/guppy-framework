import assert = require('assert');

import { MetadataRegistry } from "../../../core/MetadataRegistry";
import { Get } from "../../../http/annotations/Get";

describe('guppy.http.annotations.Get', () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("does not support using with members", () => {
        assert.throws(
            () => {
                @Get("/users")
                class UserController { }      
            }, 
            "Annotation doesn't support using with classes"
        );
    });


    it("does not registers metadata for classes", () => {
        
        class UserController {}
        
        assert.equal(
            false,
            MetadataRegistry
                .classesByMetadataKey("guppy.http.route")
                .has(UserController)
        );
    });

    it("registers metadata for members", () => {

        class UserController {
            @Get('/users/{userId}')
            public details(userId: number) { }
        }

        let memberMetadata = <Array<Object>> MetadataRegistry
                .membersByMetadataKey("guppy.http.route")
                .values()
                .next()
                .value;

        assert.equal(memberMetadata.length, 1);
        assert.equal(memberMetadata[0]["method"], "GET");
        assert.equal(memberMetadata[0]["route"], "/users/{userId}");
    });
});