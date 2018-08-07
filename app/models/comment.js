/**
 * Created by huangfy on 2017/3/5.
 */

// 创建模型
var mongoose = require("mongoose");
var CommentSchema = require("../schemas/comment"); // 引入模式
var Comment = mongoose.model("Comment",CommentSchema);

// 导出模型
module.exports = Comment;