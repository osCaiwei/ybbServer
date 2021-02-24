// import Router, { RouterContext } from '@koa/router';
// import { general } from "./controller";
import * as gatherdata from './controller/gatherdata';
import * as user from './controller/user';
import * as ys7 from './controller/ys7';
import Router from '@koa/router';
import multer from '@koa/multer';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import { config } from './config';

const unprotectedRouter = new Router();
// Hello World route

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            const t = moment();
            const dir = path.join(
                config.uploadDest,
                t.format('YYYY'),
                t.format('MM'),
                t.format('DD'),
            );
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {
                        recursive: true,
                    });
                }
                callback(null, dir);
            } catch (e) {
                callback(e, dir);
            }
        },
        filename: (req, file, callback) => {
            const prefix = new Date().getTime().toString(16).slice(-8);
            callback(null, `${prefix}_${file.originalname}`);
        },
    }),
});

unprotectedRouter.post('/upload', upload.any(), gatherdata.upload);
unprotectedRouter.post('/updata', gatherdata.updata);
unprotectedRouter.get('/list', gatherdata.list);
unprotectedRouter.get('/getid', gatherdata.getid);
unprotectedRouter.get('/getlocation', gatherdata.getlocation);
unprotectedRouter.get('/getlist', gatherdata.getlist);
unprotectedRouter.get('/getcharts', gatherdata.chartData);
unprotectedRouter.get('/getarea', gatherdata.getDistributionArea);
unprotectedRouter.post('/waterquality', gatherdata.waterQualityCharts);
unprotectedRouter.get('/haswaterquality', gatherdata.hasWaterQuality);
unprotectedRouter.get('/ys7/token', ys7.getToken);
unprotectedRouter.get('/querytotal', gatherdata.queryTotal);
unprotectedRouter.post('/getprice', gatherdata.getPrice);
unprotectedRouter.post('/getuser',user.getUserList);
unprotectedRouter.post('/waterqualitylist',gatherdata.waterQualityList);

export { unprotectedRouter };
