import { Context, Middleware } from 'koa';
import winston, { transports, format } from 'winston';
import { config } from './config';

export const logger = (): Middleware => {
    winston.configure({
        level: config.debugLogging ? 'debug' : 'info',
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new transports.File({ filename: 'error.log', level: 'error' }),
            //
            // - Write to all logs with specified level to console.
            new transports.Console({
                format: format.combine(format.colorize(), format.simple()),
            }),
        ],
    });

    return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
        const start = new Date().getTime();

        await next();

        const ms = new Date().getTime() - start;

        let logLevel: string;
        if (ctx.status >= 500) {
            logLevel = 'error';
        } else if (ctx.status >= 400) {
            logLevel = 'warn';
        } else {
            logLevel = 'info';
        }

        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

        winston.log(logLevel, msg);
    };
};
