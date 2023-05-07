// import createError from 'http-errors';
// import 'dotenv/config';
// import express from 'express';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
// import cron from 'node-cron';
// import cronApi from './routes/crons';
// import { insertIntoRechargeHistoryTBL } from './crons/rechargeHistoryMdasInsert';
// import { getAllOpenStatusRecords } from './crons/procesAllOpenStatusRecords';
// import updateStatusToOpen from './crons/suspendRequestsCron';

// import { pushRequestsFromCpToMdms } from './crons/cpcj/insert_recharge_mdms';
// import { insertInstantaneousPh1 } from './crons/cpcj/single_phase';
// import { insertInstantaneousBlockPh1 } from './crons/cpcj/single_phase_block_load';
// import { billingEveryMonthPh1 } from './crons/cpcj/billing_everymonth';
// import { insertIntoEPDCL } from './crons/cpcj/insertCPtoEPDCL';
// import { insertMdmsToCP } from './crons/cpcj/insertMdmsToCP';

// var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// app.use(cookieParser());

// // process all Inprogress staus into open status after 8 hrs 
// // cron.schedule('0 0 */8 * * *', () => {
// cron.schedule('0 */1 * * * *', () => {
//     console.log('insertgetbalancerequeststomdas');
//     insertIntoRechargeHistoryTBL();
// });

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {

//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// const port = 3006;
// app.listen(port, () => console.log(`app running on port ${port}!`));

