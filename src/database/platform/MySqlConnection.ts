import { Connection, ResultStatement, Statement, Transactional, ConnectionError } from "../index";
import { createConnection, Connection as NativeConnection, FieldPacket, Query, RowDataPacket } from "mysql";

const DEFAULT_TIMEOUT = 40000;

export class MySqlConnectionError extends ConnectionError {

    public code: string;

    public constructor(message: string, code: string, stack: string) {
        super(message);
        this.code = code;
        this.stack = stack;
    }

    static fromError(error): MySqlConnectionError {
        switch (error.code) {
            case "ECONNREFUSED":
                return new MySqlConnectionError("Cannot connect to the database server.", error.code, error.stack);

            default:
                return new MySqlConnectionError("Unknown error.", error.code, error.stack);
        }
    }
}

export class MySqlResultStatement extends ResultStatement {

    /** @internal */
    private nativeConnectionPromise: Promise<NativeConnection>;

    /** @internal */
    private nativeConnection: NativeConnection;

    /** @internal */
    private nativeQuery: Query;

    /** @internal */
    private fields: any;

    /** @internal */
    private query: string;

    /** @internal */
    public constructor(nativeConnection: Promise<NativeConnection>, query: string) {
        super();
        this.nativeConnectionPromise = nativeConnection;
        this.query = query;
    }

    /** @internal */
    private nextRowContext: {
        resolve: Function,
        reject: Function
    };

    /** @internal */
    private initStream(rowHandler: (row: RowDataPacket) => void): Promise<void> {

        return this.nativeConnectionPromise.then(nativeConnection => {

            this.nativeConnection = nativeConnection;
            this.nativeQuery = this.nativeConnection.query(this.query);
            this.nativeConnection.pause();

            this.nativeQuery.on("fields", fields => this.fields = fields);
            this.nativeQuery.on("error", error => this.nextRowContext.reject(error));
            this.nativeQuery.on("result", rowHandler);
            this.nativeQuery.on("end", () => this.nextRowContext.resolve(null));
        });
    }

    /** @internal */
    private nextRow() {
        return new Promise((resolve, reject) => {
            this.nextRowContext = { resolve, reject };
            this.nativeConnection.resume();
        });
    }

    public fetch(): Promise<Object> {

        if (!this.nativeConnection) {
            return this
                .initStream(row => {
                    this.nextRowContext.resolve(row);
                    this.nativeConnection.pause();
                })
                .then(() => this.nextRow());
        }

        return this.nextRow();
    }

    public fetchAll(): Promise<Object[]> {
        return new Promise((resolve, reject) => this.nativeConnection.query(
            {
                sql: this.query,
                timeout: DEFAULT_TIMEOUT
            },
            (error, results) => {
                if (error) return reject(error);
                resolve(results);
            }
        ));
    }

    public fetchColumn(column?: string | number): Promise<string|number|boolean|null> {

        if (!this.nativeConnection) {
            return this
                .initStream(row => {
                    if (typeof column === "string") {
                        this.nextRowContext.resolve(row[column] || null);
                    } else {
                        const field = this.fields[column || 0];
                        this.nextRowContext.resolve(field ? row[field.name] : null);
                    }

                    this.nativeConnection.pause();
                })
                .then(() => this.nextRow());
        }

        return this.nextRow();
    }
}

export class MySqlStatement extends Statement {

    public bindValue(param: string, value: string|number|boolean): Statement {
        return undefined;
    }

    public execute(): Promise<void> {
        return undefined;
    }

    public rowCount(): Promise<number> {
        return undefined;
    }

    public fetch(): Promise<Object> {
        return undefined;
    }

    public fetchAll(): Promise<Object[]> {
        return undefined;
    }

    public fetchColumn(columnIndex?: number): Promise<string|number|boolean> {
        return undefined;
    }
}

export class MySqlConnection extends Connection {

    private url: string;

    /** @internal */
    private nativeConnection: NativeConnection;

    public constructor(url: string) {
        super();
        this.url = url;
    }

    /** @internal */
    private async connection(): Promise<NativeConnection> {

        if (!this.isConnected()) await this.connect();

        return this.nativeConnection;
    }

    public isConnected(): boolean {
        return this.nativeConnection !== void 0;
    }

    public connect(): Promise<void> {

        if (this.isConnected()) return Promise.resolve();

        this.nativeConnection = createConnection(this.url);
        return new Promise((resolve, reject) => {
            this.nativeConnection.connect(error => {
                if (error) return reject(
                    MySqlConnectionError.fromError(error)
                );

                resolve();
            });
        });
    }

    public close(): Promise<void> {

        if (!this.nativeConnection) return Promise.resolve();

        return new Promise((resolve, reject) => {
            this.nativeConnection.end(error => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    public query(query: string): ResultStatement {
        return new MySqlResultStatement(this.connection(), query);
    }

    public prepare(query:string): Statement {
        return new MySqlStatement();
    }

    public transactional(payload: Transactional): Promise<void> {
        return Promise
            .resolve()
            .then(payload)
            .then(() => this.commit())
            .catch(() => this.rollback());
    }

    public beginTransaction(): Promise<void> {

        const beginTransaction = () => new Promise((resolve, reject) => {
            this.nativeConnection.beginTransaction(error => {
                if (error) return reject(error);
                resolve();
            });
        });

        return this.isConnected()
            ? beginTransaction()
            : this.connect().then(beginTransaction);
    }

    public commit(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nativeConnection.commit(error => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

    public rollback(): Promise<void> {
        return new Promise(resolve => {
            this.nativeConnection.rollback(resolve)
        });
    }
}