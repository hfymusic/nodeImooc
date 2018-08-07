/**
 * Created by huangfy on 2017/3/7.
 */

var Category = require("../models/category");

// admin new page
exports.new = function(req,res){
    res.render("category_admin",{
        title: "imooc 后台分类录入页",
        category: {}
    });
};

// admin post movie
exports.save = function(req,res){
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err,category){
        if(err){
            console.log(err);
        }

        res.redirect("/admin/category/list");
    });
};

// list page
exports.list = function(req,res){
    Category.fetch(function(err,categorys){
        if(err){ // 如果异常，在控制台打印异常信息
            console.log(err);
        }
        // 将获取到的电影列表渲染到页面中
        res.render("categorylist",{
            title: "imooc 分类列表页",
            categorys: categorys
        });
    });
};