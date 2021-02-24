import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface Config {
    host: string;
    port: number;
    debugLogging: boolean;
    dbsslconn: boolean;
    salt: string;
    jwtSecret: string;
    databaseUrl_ybb1: string;
    databaseUrl_ybb2: string;
    databaseUrl_ybb3: string;
    dbEntitiesPath: string[];
    dbEntitiesPath2: string[];
    dbEntitiesPath3: string[];
    cronJobExpression: string;
    uploadDest: string;
    wxAppId: string;
    wxAppSecret: string;
    mapkey: string;
    ys7AppKey: string;
    ys7AppSecret: string;
    ys7RamAccountId: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

// 不要直接在这里修改配置参数，在.env文件中配置，不能把生产环境的数据库用户密码提交到GIT仓库！

export const config: Config = {
    host: process.env.HOST || 'localhost',
    port: +(process.env.PORT || 3000),
    debugLogging: isDevMode,
    // dbsslconn: !isDevMode,
    dbsslconn: false,
    salt: process.env.PASSWORD_SALT || 'your-password-salt',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
    databaseUrl_ybb1:
        process.env.DATABASE_URL1 ||
        'postgres://postgres:postgres@localhost:5432/getdata',
    databaseUrl_ybb2:
        process.env.DATABASE_URL2 ||
        'postgres://postgres:postgres@localhost:5432/getdata',
    databaseUrl_ybb3:
        process.env.DATABASE_URL3 ||
        'postgres://postgres:postgres@localhost:5432/getdata',
    dbEntitiesPath: [
        ...(isDevMode
            ? ['src/entity/ybb1/**/*.ts']
            : ['dist/entity/ybb1/**/*.js']),
    ],
    dbEntitiesPath2: [
        ...(isDevMode
            ? ['src/entity/ybb2/**/*.ts']
            : ['dist/entity/ybb2/**/*.js']),
    ],
    dbEntitiesPath3: [
        ...(isDevMode
            ? ['src/entity/archive/**/*.ts']
            : ['dist/entity/archive/**/*.js']),
    ],
    cronJobExpression: '0 * * * *',
    uploadDest: process.env.UPLOAD_DEST || 'upload',
    // 不要直接在这里配置微信参数，在.env文件中配置，不能把生产环境的appID和secret提交到GIT仓库！
    wxAppId: process.env.WX_APP_ID || 'wx9ed43c4c96826885',
    wxAppSecret:
        process.env.WX_APP_SECRET || '0dc77e4708d3b7824d8662b048c5b380',
    mapkey: process.env.AMAP_KEY || '9ddbf963516080a8de075a596548cf6d',
    ys7AppKey: process.env.YS7_APP_KEY || '',
    ys7AppSecret: process.env.YS7_APP_SECRET || '',
    ys7RamAccountId: process.env.YS7_RAM_ACCOUNT_ID || '',
};
