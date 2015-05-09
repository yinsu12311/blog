
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);//设置端口为process.env.PORT 或 3000
app.set('views', path.join(__dirname, 'views'));//设置views文件夹为存放视图文件的目录
app.set('view engine', 'ejs');//设置视图模块引擎为ejs
app.use(flash());
app.use(express.favicon());//使用默认的favicon图标
app.use(express.logger('dev'));//在终端显示日志

// app.use(express.json());
// app.use(express.urlencoded());
app.use(express.bodyParser());//表单的时候用
app.use(express.methodOverride());//协助出来POST请求

app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.db,//cookie name
	cookie: {maxAge: 1000*60*60*24*30},//30 days
	store: new MongoStore({
		db: settings.db
	})
}));

app.use(app.router);//调用路由解析的规则
app.use(express.static(path.join(__dirname, 'public')));

// development only  错误处理 输出错误信息
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index); //控制路由器
// app.get('/users', user.list);

//创建http服务器并监听3000端口
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);