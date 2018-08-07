/**
 * Created by huangfy on 2017/3/5.
 */

var Comment = require("../models/comment");

exports.save = function(req,res){
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    // 判断提交过来的comment对象中是否有cid
    if(_comment.cid){
        Comment.findById(_comment.cid,function(err,comment){
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            };

            comment.reply.push(reply);

            comment.save(function(err,comment){
                if(err){
                    console.log(err);
                }

                res.redirect("/movie/" + movieId);
            });
        });
    }else{
        // 没有cid，则认为是简单的评论
        var comment = new Comment(_comment);

        comment.save(function(err,comment){
            if(err){
                console.log(err);
            }

            // 保存评论后，跳转回当前电影详情页
            res.redirect("/movie/" + movieId);
        });
    }
};