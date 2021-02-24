import { RouterContext } from '@koa/router';
import { getRamToken } from '../ys7';

export const getToken = async (ctx: RouterContext): Promise<void> => {
    const token = await getRamToken();
    if (!token) {
        ctx.status = 500;
        return;
    }
    ctx.body = token;
};
