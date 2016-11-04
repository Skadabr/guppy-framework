import * as assert from "assert";

import { Topic, Observes, ObserverRegistry, ObserverMetadata } from "../../messaging";

describe("guppy.messaging.Observes", () => {

    it("registers an observer method", () => {

        @Topic("users.registered")
        class UserRegistered {
            userId: number;
        }

        class MailSender {

            @Observes(UserRegistered)
            public sendWelcomeMail(event: UserRegistered) {

            }
        }

        const observerRegistry = new ObserverRegistry();
        const observers: Map<Function, ObserverMetadata> = observerRegistry.all();

        assert.ok(observers.has(UserRegistered));
        assert.equal(observers.get(UserRegistered).observerClass, MailSender);
        assert.equal(observers.get(UserRegistered).observerMethod, "sendWelcomeMail");
    });

    it("registers an observer class", () => {

        @Topic("users.registered")
        class UserRegistered {
            userId: number;
        }

        @Observes(UserRegistered)
        class MailSender {

            public handle(message: UserRegistered) {

            }
        }

        const observerRegistry = new ObserverRegistry();
        const observers: Map<Function, ObserverMetadata> = observerRegistry.all();

        assert.ok(observers.has(UserRegistered));
        assert.equal(observers.get(UserRegistered).observerClass, MailSender);
        assert.equal(observers.get(UserRegistered).observerMethod, "handle");
    });

    it("requires a handling method for an observer class", () => {

        @Topic("users.registered")
        class UserRegistered {
            userId: number;
        }
        
        assert.throws(
            () => {
                @Observes(UserRegistered)
                class MailSender {
                }        
            },
            /Method MailSender#handle\(message: UserRegistered\) must me implemented./
        );
    });

    it("requires a valid messaged for observing", () => {

        class UserRegistered {
            userId: number;
        }

        assert.throws(
            () => {
                @Observes(UserRegistered)
                class MailSender {
                }
            },
            /Observer cannot handle messages without channel info./
        );
    });
});