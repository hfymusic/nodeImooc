/**
 * Created by huangfy on 2017/3/5.
 */

var Movie = require("../models/movie");
var Category = require("../models/category");

// index page
exports.index = function(req,res){
    Category
        .find({})
        .populate({
            path: "movies",
            select: "title poster",
            options: {limit: 6}
        })
        .exec(function(err,categories){
            if(err){ // 如果异常，在控制台打印异常信息
                console.log(err);
            }
            // 将获取到的电影列表渲染到页面中
            res.render("index",{
                title: "imooc 首页",
                categories: categories
            });
        });
};

exports.search = function(req,res){
    // 从地址栏获取参数，并且计算索引
    var catId = req.query.cat;
    var q = req.query.q;
    var page = parseInt(req.query.p, 10) || 0;
    var count = 2;
    var index = page * count;

    // 有搜索id，说明是分类
    if(catId){
        // 分类查询
        Category
            .find({_id: catId})
            .populate({
                path: "movies",
                select: "title poster"
            })
            .exec(function(err,categories){
                if(err){ // 如果异常，在控制台打印异常信息
                    console.log(err);
                }

                var category = categories[0] || {};
                var movies = category.movies || [];
                var results = movies.slice(index, index + count);

                res.render("results",{
                    title: "imooc 结果列表页",
                    keyword: category.name,
                    currentPage: (page + 1),
                    query: "cat=" + catId,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    }else{
        // 没有id说明是从搜索框提交过来的请求
        Movie
            .find({title: new RegExp(q + ".*","i")})
            .exec(function(err,movies){
                if(err){
                    console.log(err);
                }

                var results = movies.slice(index, index + count);
                res.render("results",{
                    title: "imooc 结果列表页",
                    keyword: q,
                    currentPage: (page + 1),
                    query: "q=" + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            })
    }
};