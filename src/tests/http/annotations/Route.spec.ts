import assert = require('assert');

import { MetadataRegistry } from "../../../core";
import { Route } from "../../../http/annotations";

describe('guppy.http.annotations.Route', () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("does not support using with members", () => {

        assert.throws(
            () => {
                @Route("GET", "/users")
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
            @Route("GET", "/users/{userId}")
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