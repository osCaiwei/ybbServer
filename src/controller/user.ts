import { RouterContext } from '@koa/router';
import { getManager, Repository } from 'typeorm';
import { User } from '../entity/ybb1/user';


export const getUserList = async (ctx: RouterContext):Promise<void> => {
    console.log(ctx.request.body);
    const { pageSize, current, where } = ctx.request.body;
    const page = parseInt(current) || 1;
    const size = parseInt(pageSize) || 10;
    const userRepository: Repository<User> = getManager('ybb1').getRepository(User);
    const [users, total] = await userRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        where: where
    });
    ctx.body = {
        total,
        pageSize: size,
        current: page,
        data: users,
    };
};
