import createError from 'http-errors';
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cron from 'node-cron';
import cronApi from './routes/crons';
import { insertIntoRechargeHistoryTBL } from './crons/rechargeHistoryMdasInsert';
import { getAllOpenStatusRecords } from './crons/procesAllOpenStatusRecords';
import updateStatusToOpen from './crons/suspendRequestsCron';

import { pushRequestsFromCpToMdms } from './crons/cpcj/insert_recharge_mdms';
import { insertInstantaneousPh1 } from './crons/cpcj/single_phase';
import { insertInstantaneousBlockPh1 } from './crons/cpcj/single_phase_block_load';
import { billingEveryMonthPh1 } from './crons/cpcj/billing_everymonth';
import { insertIntoEPDCL } from './crons/cpcj/insertCPtoEPDCL';
import { insertMdmsToCP } from './crons/cpcj/insertMdmsToCP';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cookieParser());

cron.schedule('0 */1 * * * *', () => {
  pushRequestsFromCpToMdms();
});

// calling every 1mins
// cron.schedule('*/59 * * * * *', () => {
//   console.log('insertMdmsToCP');
//   // insertMdmsToCP();
// });

// // Calling every min
// cron.schedule('0 */1 * * * *', () => {
//   console.log('pushRequestsFromCpToMdms');
//   // pushRequestsFromCpToMdms();
// });

// // calling every 15mins
// cron.schedule('0 */15 * * * *', () => {
//   console.log('insertInstantaneousPh1');
//   // insertInstantaneousPh1();
// });

// // calling every 15mins
// cron.schedule('0 */22 * * * *', () => {
//   console.log('insertInstantaneousPh1, insertIntoEPDCL');
//   insertIntoEPDCL();
//   // insertInstantaneousPh1();
// });

// // calling every 30 mins
// cron.schedule('0 */30 * * * *', () => {
//   console.log('insertInstantaneousBlockPh1');
//   // insertInstantaneousBlockPh1();
// });

// // calling every month on 1st
// cron.schedule('0 0 1 * * *', () => {
//   console.log('billingEveryMonthPh1');
//   // billingEveryMonthPh1();
// });

// // Cron job 5-2 Block  for every 30 minutes

// cron.schedule('*/20 * * * * *', () => {
//   console.log('Cron job 5-2 Block');
//   // insertInstantaneousPh3();
// });

// // Cron api fetching and inset start here!
// cron.schedule('*/20 * * * * *', () => {
//   console.log('Cron api fetching and insert started!');
//   //  cronApi();
// });

// // Insert data into Recharge
// cron.schedule('*/30 * * * * *', () => {
//   // cron.schedule('*/30 */06 * * *', () => {
//   // Insert into Mdas recharge table from api
//   // insetIntoRechargeHistoryTBL();
// });

// // Process all open records
// cron.schedule('*/30 * * * * *', () => {
//   // console.log(new Date().getMinutes());
//   console.log('Process all open records cron started!');
//   // getAllOpenStatusRecords();

// });

// // process all Inprogress staus into open status after 8 hrs 
// // cron.schedule('0 0 */8 * * *', () => {
// cron.schedule('*/30 * * * * *', () => {
//   console.log('process all Inprogress staus into open status after 8 hrs Cron Started!');
//   // updateStatusToOpen();
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('app running on port 3000!'));


export default app;
