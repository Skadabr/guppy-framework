import * as assert from "assert";

import { Topic, ChannelType } from "../../messaging";

describe("guppy.messaging.Topic", () => {

    it("specifies a topic of a message", () => {

        @Topic("users.registered")
        class UserRegistered {
            userId: number;
        }

        assert.equal(UserRegistered["channelType"], ChannelType.Topic);
        assert.equal(UserRegistered["channelName"], "users.registered");
    });
    
    it("throws an error on applying to a member", () => {

        assert.throws(
            () => {
                class UserRegistered {
                    @Topic("users.registered")
                    method() { }
                }
            },
            /Annotation @Topic cannot be applied to members./
        );
    })
});