import assert = require("assert");

import { MetadataRegistry } from "../../core";

describe("guppy.core.MetadataRegistry", () => {

    before(() => {
        MetadataRegistry.clear();
    });

    it("returns null for non existing metadata key", () => {
        class UserController {
            list() {}
        }

        assert.equal(MetadataRegistry.memberMetadata("my-metadata-key", UserController, "list"), null);
    });

    it("returns null for non existing metadata for class", () => {
        class UserController {
            list() {}
        }

        MetadataRegistry.putForMember(Date, "toString", "my-metadata-key", {});

        assert.equal(MetadataRegistry.memberMetadata("my-metadata-key", UserController, "list"), null);
    });

    it("returns null for non existing metadata for members", () => {
        class UserController {
            list() {}
        }

        MetadataRegistry.putForMember(UserController, "toString", "my-metadata-key", {});

        assert.equal(MetadataRegistry.memberMetadata("my-metadata-key", UserController, "list"), null);
    });

});