/**
 * Created by huangfy on 2017/2/14.
 */

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var mongoose = require("mongoose");
var mongoStore = require("connect-mongo")(session);
var logger = require('morgan');
var connectMultiparty = require("connect-multiparty");
/**
 * 使用 connect-multiparty 的同时还需要安装 multipart，否则报错。multipart不用引入，但必须安装。没明白
 * */

var path = require("path");
var port = process.env.PORT || 27017; // 设置端口
var app = express(); // 启动web服务器
var dbUrl = "mongodb://localhost:27017/imooc_2";

// 调用 mongoose 的方法连接数据库
mongoose.connect(dbUrl); // imooc_2 数据库名称

app.set("views","./app/views/pages"); // 设置视图根目录
app.set("view engine","jade"); // 设置默认模板引擎
app.use(cookieParser());
app.use(connectMultiparty());
app.use(session({
    secret: "imooc",
    store: new mongoStore({
        url: dbUrl,
        collection: "sessions"
    })
}));
app.use(bodyParser.urlencoded({ extended: true })); // 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型
app.use(express.static(path.join(__dirname,"./public"))); // 设置public为静态文件存放根目录
app.locals.moment = require("moment"); // 格式化时间
app.listen(port); // 监听端口

console.log("imooc_2 started on port " + port);

if("development" === app.get("env")){
    app.set("showStackError",true);
    app.use(logger(":method :url :status"));
    app.locals.pretty = true;
    mongoose.set("debug",true);
}

// 引入路由文件，并传入当前app
require("./config/routes")(app);