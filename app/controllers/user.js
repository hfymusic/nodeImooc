/**
 * Created by huangfy on 2017/3/5.
 */

var User = require("../models/user");

// signup
exports.showSignup = function(req,res){
    res.render("signup",{
        title: "注册页面"
    });
};
// signin
exports.showSignin = function(req,res){
    res.render("signin",{
        title: "登录页面"
    });
};
// signup
exports.signup = function(req,res){
    var _user = req.body.user;

    // 查询数据是否当前用户名已存在
    User.findOne({name: _user.name},function(err,user){
        if(err){
            console.log(err);
        }

        if(user){
            // 用户名已存在，返回登录页
            return res.redirect("/signin");
        }else{
            // 用户名不存在，则生成新用户
            var user = new User(_user);
            user.save(function(err,user){
                if(err){
                    console.log(err);
                }
                // 重定向
                res.redirect("/");
            });
        }
    });
};

// signin
exports.signin = function(req,res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name},function(err,user){
        if(err){
            console.log(err);
        }

        // 如果用户不存在，返回注册页
        if(!user){
            return res.redirect("/signup");
        }

        // 用户存在，匹配密码
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err);
            }
            if(isMatch){
                // 在内存中保存用户状态
                req.session.user = user;
                return res.redirect("/");
            }else{
                return res.redirect("/signin");
            }
        });
    });
};

// logout
exports.logout = function(req,res){
    // 删除session和本地的用户信息，并且跳转到首页
    delete req.session.user;
    //delete app.locals.user;

    res.redirect("/");
};

// userlist page
exports.list = function(req,res){
    User.fetch(function(err,users){
        if(err){ // 如果异常，在控制台打印异常信息
            console.log(err);
        }
        // 将获取到的电影列表渲染到页面中
        res.render("userlist",{
            title: "imooc 用户列表页",
            users: users
        });
    });
};

// middleWare for user
exports.signinRequired = function(req,res,next){
    var user = req.session.user;

    // 用户不存在，重定向到登录页
    if(!user) return res.redirect("/signin");

    next();
};
exports.adminRequired = function(req,res,next){
    var user = req.session.user;

    // 用户没有权限，重定向到登录页
    if(user.role <= 10){
        return res.redirect("/signin");
    }

    next();
};