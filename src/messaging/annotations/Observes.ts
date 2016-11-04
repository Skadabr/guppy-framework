import { ObserverRegistry } from "../ObserverRegistry";

export function Observes(messageClass: Function): Function {

    return (targetClass: Function, propertyName: string) => {

        if (messageClass["channelType"] === void 0) {
            throw new Error("Observer cannot handle messages without channel info.");
        }

        if (propertyName === void 0) {
            if (targetClass.prototype["handle"] === void 0) {
                throw new Error(`Method ${targetClass.name}#handle(message: ${messageClass.name}) must me implemented.`);
            }

            propertyName = "handle";
        } else {
            targetClass = targetClass.constructor;
        }

        ObserverRegistry.prebootRegister(messageClass, {
            observerClass: targetClass,
            observerMethod: propertyName
        });
    };
}