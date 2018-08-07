/**
 * Created by huangfy on 2017/3/2.
 */

// 创建模型
var mongoose = require("mongoose");
var UserSchema = require("../schemas/user"); // 引入模式
var User = mongoose.model("User",UserSchema);

// 导出模型
module.exports = User;