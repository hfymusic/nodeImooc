/**
 * Created by huangfy on 2017/3/5.
 */

var underscore = require("underscore");
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var fs = require("fs");
var path = require("path");

// detail page
exports.detail = function(req,res){
    var id = req.params.id;

    Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
        if(err){
            console.log(err);
        }
    });
    Movie.findById(id,function(err,movie){
        Comment
            .find({movie: id})
            .populate("from","name")
            .populate("reply.from reply.to","name")
            .exec(function(err,comments) {
                console.log("comments: ");
                console.log(comments);

                res.render("detail", {
                    title: "imooc " + movie.title,
                    movie: movie,
                    comments: comments
                });
            });
    });
};

// admin new page
exports.new = function(req,res){
    Category.find({},function(err,categories){
        res.render("admin",{
            title: "imooc 后台录入页",
            categories: categories,
            movie: {}
        });
    });
};

// admin update movie
exports.update = function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            Category.find({},function(err,categories){
                res.render("admin",{
                    title: "imooc 后台更新页",
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
};

// admin poster
exports.savePoster = function(req,res,next){
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    console.log("海报：");
    console.log(req.files);
    if(originalFilename){
        fs.readFile(filePath, function(err,data){
            var timestamp = Date.now();
            var type = posterData.type.split("/")[1];
            var poster = timestamp + "." + type;
            var newPath = path.join(__dirname,"../../","/public/upload/" + poster);

            fs.writeFile(newPath, data, function(err){
                req.poster = poster;
                next();
            });
        });
    }else{
        next();
    }
};

// admin post movie
exports.save = function(req,res){
    // 要判断是新增数据还是修改数据，查询是否有id
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    // 如果有新上传的海报，则把新地址存入 movieObj 对象中
    if(req.poster){
        movieObj.poster = req.poster;
    }

    if(id){ // id存在，说明是修改数据
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            _movie = underscore.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                // 保存成功后，跳入相应的电影详情页
                res.redirect("/movie/" + movie._id);
            });
        });
    }else{ // id不存在，说明是新增数据
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }

            if(categoryId){
                Category.findById(categoryId,function(err,category){
                    category.movies.push(movie._id);

                    category.save(function(err,category){
                        res.redirect("/movie/" + movie._id);
                    });
                });
            }else if(categoryName){
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err,category){
                    movie.category = category._id;
                    movie.save(function(err,movie){
                        if(err){
                            console.log(err);
                        }

                        res.redirect("/movie/" + movie._id);
                    });
                });
            }

        });
    }
};

// list page
exports.list = function(req,res){
    Movie.fetch(function(err,movies){
        if(err){ // 如果异常，在控制台打印异常信息
            console.log(err);
        }
        // 将获取到的电影列表渲染到页面中
        res.render("list",{
            title: "imooc 列表页",
            movies: movies
        });
    });
};

// list delete movie
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id: id},function(err,movie){
            if(err){
                console.log(err);
            }else{
                res.json({success: 1});
            }
        });
    }
};