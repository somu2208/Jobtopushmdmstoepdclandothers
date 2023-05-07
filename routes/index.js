import express from 'express';
var router = express.Router();
// import cron from 'node-cron';
/* GET home page. */
router.get('/run-cron', function (req, res, next) {
  var password = 'password';
  res.render('index', { title: 'Express' });
});

export  default router;
