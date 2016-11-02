export abstract class Logger {
    public abstract trace(message: string, ...args: any[]);
    public abstract debug(message: string, ...args: any[]);
    public abstract info(message: string, ...args: any[]);
    public abstract warn(message: string, ...args: any[]);
    public abstract error(message: string, ...args: any[]);
    public abstract fatal(message: string, ...args: any[]);
}