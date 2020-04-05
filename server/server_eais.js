const createError = require('http-errors');

const express = require('express');

const cors = require('cors');

const path = require('path');

const cookieParser = require('cookie-parser');

const logger = require('morgan');

const indexRouter = require('./routes/index');

const apiRouter = require('./routes/api');

const app = express();

const database = require('./config/database');

database.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

try {
  app.listen(5500);
  console.log('5500 포트 시작');
} catch (error) {
  console.log('error');
}

module.exports = app;
