var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

var flash = require('connect-flash');//req.flash()使用

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({//---必须放在视图交互的前面
    secret: settings.cookieSecret,//secret 用来防止篡改 cookie
    //设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失。
    store: new MongoStore({
        db: settings.db
    })
}));

app.use(flash());//定义使用 flash 功能

//视图交互
app.use(function(req, res, next){
    console.log("app.usr local");
	
    //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
    //访问session数据：用户信息
    res.locals.user = req.session.user;
	
    //获取要显示错误信息
    var error = req.flash('error');//获取flash中存储的error信息
    res.locals.error = error.length ? error : null;
	
    //获取要显示成功信息
    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
	
    next();//控制权转移，继续执行下一个app.use()
});

app.use('/', index);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
