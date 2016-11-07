import { Connection, AcknowledgeMode, Session } from "../common";
import { NativeConnection, NativeSession } from "./common";
import { AmqpQueueSession } from "./AmqpQueueSession";
import { AmqpTopicSession } from "./AmqpTopicSession";

export class AmqpConnection extends Connection {

    private nativeConnectionPromise: Promise<NativeConnection>;
    private nativeConnection: NativeConnection;

    public constructor(nativeConnectionPromise: Promise<NativeConnection>) {
        this.nativeConnectionPromise = nativeConnectionPromise;
    }

    private getNativeConnection(): Promise<NativeConnection> {
        return (this.nativeConnection !== void 0)
            ? Promise.resolve(this.nativeConnection)
            : this.nativeConnectionPromise.then(
            (nativeConnection: NativeConnection) => this.nativeConnection = nativeConnection
        );
    }

    public createQueueSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): Promise<Session> {
        return this.getNativeConnection()
            .then((nativeConnection: NativeConnection) => nativeConnection.createChannel())
            .then((nativeSession: NativeSession) => new AmqpQueueSession(nativeSession));
    }

    public createTopicSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): Promise<Session> {
        return this.getNativeConnection()
            .then((nativeConnection: NativeConnection) => nativeConnection.createChannel())
            .then((nativeSession: NativeSession) => new AmqpTopicSession(nativeSession));
    }

    public close(): Promise<void> {
        return this.getNativeConnection().then(
            (nativeConnection: NativeConnection) => nativeConnection.close()
        );
    }
}