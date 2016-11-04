import * as assert from "assert";

import { Message, ChannelType } from "../../messaging";

describe("guppy.messaging.Message", () => {

    it("specifies a channel of a message", () => {

        @Message(ChannelType.Topic, "users.registered")
        class UserRegistered {
            userId: number;
        }

        assert.equal(UserRegistered["channelType"], ChannelType.Topic);
        assert.equal(UserRegistered["channelName"], "users.registered");
    });
    
    it("throws an error on applying to a member", () => {

        assert.throws(
            () => {
                class FetchSiteSummary {
                    @Message(ChannelType.Queue, "sites.fetch-summary")
                    method() { }
                }
            },
            /Annotation @Message cannot be applied to members./
        );
    })
});