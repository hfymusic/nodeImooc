/**
 * Created by huangfy on 2017/2/18.
 */

// 创建模型
var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie"); // 引入模式
var Movie = mongoose.model("Movie",MovieSchema);

// 导出模型
module.exports = Movie;