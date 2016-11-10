import { Connection, AcknowledgeMode, Session } from "../abstract";
import { NativeConnection, NativeSession } from "./common";
import { AmqpSession } from "./AmqpSession";

export class AmqpConnection extends Connection {

    /** @internal */
    private nativeConnectionPromise: Promise<NativeConnection>;

    /** @internal */
    private nativeConnection: NativeConnection;

    /** @internal */
    private sessionFactory: (nativeSession: NativeSession) => AmqpSession;

    /** @internal */
    public constructor(
        nativeConnectionPromise: Promise<NativeConnection>,
        sessionFactory: (nativeSession: NativeSession) => AmqpSession
    ) {
        super();
        this.nativeConnectionPromise = nativeConnectionPromise;
        this.sessionFactory = sessionFactory;
    }

    /** @internal */
    private getNativeConnection(): Promise<NativeConnection> {
        return (this.nativeConnection !== void 0)
            ? Promise.resolve(this.nativeConnection)
            : this.nativeConnectionPromise.then(
                (nativeConnection: NativeConnection) => this.nativeConnection = nativeConnection
            );
    }

    public createSession(transacted: boolean, acknowledgeMode: AcknowledgeMode): Promise<Session> {
        return this
            .getNativeConnection()
            .then((nativeConnection: NativeConnection) => nativeConnection.createChannel())
            .then((nativeSession: NativeSession) => this.sessionFactory(nativeSession));
    }

    public close(): Promise<void> {
        return this
            .getNativeConnection()
            .then((nativeConnection: NativeConnection) => nativeConnection.close());
    }
}