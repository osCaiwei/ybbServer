# 牦牛耳标项目服务端
## 配置项

可在.env文件或环境变量中设置

- HOST 监听的IP
- PORT 监听的端口
- DATABASE_URL 数据库连接 `postgres://{db_user}:{db_password}@{ip}:{port}/{db_name}`

## 常用命令
- 安装依赖 `yarn install`
- 启动开发服务器 `yarn watch-server`
- TS编译成JS `yarn build`
- 生产环境运行编译后的 `yarn start`