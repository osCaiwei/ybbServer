import 'reflect-metadata';
import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import serve from 'koa-static';
import mount from 'koa-mount';
import { createConnection } from 'typeorm';

// import { User } from './entity/User';
import { logger } from './logger';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';
// import { cron } from "./cron";

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
Promise.all([
    createConnection({
        name: 'ybb1',
        type: 'postgres',
        url: config.databaseUrl_ybb1,
        synchronize: true,
        logging: false,
        entities: config.dbEntitiesPath,
        extra: {
            ssl: config.dbsslconn, // if not development, will use SSL
        },
    }),
    createConnection({
        name: 'ybb2',
        type: 'postgres',
        url: config.databaseUrl_ybb2,
        logging: false,
        entities: config.dbEntitiesPath2,
        extra: {
            ssl: config.dbsslconn, // if not development, will use SSL
        },
    }),
    createConnection({
        name: 'archive',
        type: 'postgres',
        url: config.databaseUrl_ybb3,
        logging: false,
        entities: config.dbEntitiesPath3,
        extra: {
            ssl: config.dbsslconn, // if not development, will use SSL
        },
    }),
])
    .then(async () => {
        const app = new Koa();

        // Provides important security headers to make your app more secure
        app.use(helmet());

        app.use(mount('/uploads', serve(config.uploadDest)));

        // Enable cors with default options
        app.use(cors());

        // Logger middleware -> use winston as logger (logging.ts with config)
        app.use(logger());

        // // Enable bodyParser with default options
        app.use(bodyParser());

        // // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
        app.use(unprotectedRouter.routes()).use(
            unprotectedRouter.allowedMethods(),
        );

        // // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
        // // do not protect swagger-json and swagger-html endpoints
        app.use(
            jwt({ secret: config.jwtSecret, cookie: 'jwt' }).unless({ path: [/^\/swagger-/] }),
        );

        // // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
        app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

        // Register cron job to do any action needed
        // cron.start();

        app.listen(config.port, config.host);

        console.log(`Server running on ${config.host}:${config.port}`);
    })
    .catch((error: string) => console.log('TypeORM connection error: ', error));
