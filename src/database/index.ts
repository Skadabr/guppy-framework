export type Transactional = () => void | Promise<void>;

export abstract class ResultStatement {
    public abstract fetch(): Promise<Object>;
    public abstract fetchAll(): Promise<Object[]>;
    public abstract fetchColumn(column?: string | number): Promise<string|number|boolean|null>
}

export abstract class Statement extends ResultStatement {
    public abstract bindValue(param: string, value: string | number | boolean | null): Statement;
    public abstract execute(): Promise<void>;
    public abstract rowCount(): Promise<number>;
}

export abstract class Connection {
    public abstract isConnected(): boolean;
    public abstract connect(): Promise<void>;
    public abstract close(): Promise<void>;

    public abstract query(query: string): ResultStatement;
    public abstract prepare(query: string): Statement;

    public abstract transactional(payload: Transactional): Promise<void>;
    public abstract beginTransaction(): Promise<void>;
    public abstract commit(): Promise<void>;
    public abstract rollback(): Promise<void>;
}

export abstract class ConnectionError extends Error {

    public constructor(message) {
        super(message);
    }
}