export enum ChannelType {
    Topic,
    Queue
}

export function Message(channelType: ChannelType, channelName: string, calleeAnnotation?: Function): Function {

    return (targetClass: Function, propertyName: string) => {

        if (calleeAnnotation === void 0) calleeAnnotation = Message;

        if (propertyName) throw new Error(`Annotation @${calleeAnnotation.name} cannot be applied to members.`);

        targetClass["channelType"] = channelType;
        targetClass["channelName"] = channelName;
    };
}