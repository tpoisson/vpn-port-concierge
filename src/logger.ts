import pino, { LogFn } from "pino";

export interface ILogger {
    info: LogFn;
    error: LogFn;
    warn: LogFn;
    debug: LogFn;
}

export const log: ILogger = pino({ level: process.env.LOG_LEVEL ?? "info" });
