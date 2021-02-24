import Router from '@koa/router';
// import multer from '@koa/multer';
// import moment from 'moment';
// import path from 'path';
// import fs from 'fs';
// // import * as eartag from './controller/eartag';

// import { config } from './config';

const protectedRouter = new Router();
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req, file, callback) => {
//             const t = moment();
//             const dir = path.join(
//                 config.uploadDest,
//                 t.format('YYYY'),
//                 t.format('MM'),
//                 t.format('DD'),
//             );
//             try {
//                 if (!fs.existsSync(dir)) {
//                     fs.mkdirSync(dir, {
//                         recursive: true,
//                     });
//                 }
//                 callback(null, dir);
//             } catch (e) {
//                 callback(e, dir);
//             }
//         },
//         filename: (req, file, callback) => {
//             const prefix = new Date().getTime().toString(16).slice(-8);
//             callback(null, `${prefix}_${file.originalname}`);
//         },
//     }),
// });
// USER ROUTES

// protectedRouter.post('/eartag/upload', upload.any(), eartag.upload);

export { protectedRouter };
