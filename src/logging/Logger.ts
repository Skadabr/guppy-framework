export abstract class Logger {
    public abstract trace(message: string);
    public abstract debug(message: string);
    public abstract info(message: string);
    public abstract warn(message: string);
    public abstract error(message: string);
    public abstract fatal(message: string);
}