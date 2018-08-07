/**
 * Created by huangfy on 2017/3/7.
 */

// 创建模型
var mongoose = require("mongoose");
var CategorySchema = require("../schemas/category"); // 引入模式
var Category = mongoose.model("Category",CategorySchema);

// 导出模型
module.exports = Category;