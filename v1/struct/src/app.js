var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

let log = require('./common/log');
var i18n = require('i18n'); //多语言中间件
var cors = require('cors'); //跨域中间件
let apis = require('./routes/api');
let ws = require('./modules/ws-module');

i18n.configure({
  locales: ['zh', 'en'],
  directory: __dirname + '/locales',
  defaultLocale: 'zh',
  cookie: "lang",
  queryParameter: "lang"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(i18n.init);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
  let cookieLang = req.cookies.lang;
  if (cookieLang) {
    req.setLocale(cookieLang);
  }

  let queryLang = req.query.lang;
  if (queryLang) {
    req.setLocale(queryLang);
  }

  next();
});

app.use('/api', apis);
ws.init(app);

// catch 404 and forward to error handler
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

module.exports = app;
