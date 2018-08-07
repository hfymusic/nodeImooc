/**
 * Created by huangfy on 2017/3/2.
 */

// 创建模式，定义表结构
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password:  String,
    // 0: normal user
    // 1: verified user
    // 2: professional user
    // ...
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
    },
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
UserSchema.pre("save",function(next){
    var user = this;
    if(this.isNew){ // 判断数据是否是新加的
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{ // 数据已经存在，更新时间取当前时间
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err,hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});

// 实例方法
UserSchema.methods = {
    comparePassword: function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err) return cb(err);

            cb(null,isMatch);
        });
    }
};

// 静态方法
UserSchema.statics = {
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
module.exports = UserSchema;