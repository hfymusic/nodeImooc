/**
 * Created by huangfy on 2017/3/5.
 */

// 创建模式，定义表结构
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    movie: { type: ObjectId, ref: "Movie"},
    from: { type: ObjectId, ref: "User"},
    reply: [{
        from: { type: ObjectId, ref: "User"},
        to: { type: ObjectId, ref: "User"},
        content: String
    }],
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// pre() 每次存储数据前都会调用该方法
CommentSchema.pre("save",function(next){
    if(this.isNew){ // 判断数据是否是新加的
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{ // 数据已经存在，更新时间取当前时间
        this.meta.updateAt = Date.now();
    }

    next();
});

// 静态方法
CommentSchema.statics = {
    fetch: function(cb){ // 取出数据库中所有的数据
        return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb);
    },
    findById: function(id,cb){ // 取出单条数据
        return this
            .findOne({_id:id})
            .exec(cb);
    }
};

// 导出该模式，也就是将该模式暴露出去
module.exports = CommentSchema;