import * as assert from "assert";

import { Queue, ChannelType } from "../../messaging";

describe("guppy.messaging.Queue", () => {

    it("specifies a topic of a message", () => {

        @Queue("sites.fetch-summary")
        class UserRegistered {
            userId: number;
        }

        assert.equal(UserRegistered["channelType"], ChannelType.Queue);
        assert.equal(UserRegistered["channelName"], "sites.fetch-summary");
    });
    
    it("throws an error on applying to a member", () => {

        assert.throws(
            () => {
                class FetchSiteSummary {
                    @Queue("sites.fetch-summary")
                    method() { }
                }
            },
            /Annotation @Queue cannot be applied to members./
        );
    })
});