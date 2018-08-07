/**
 * Created by huangfy on 2017/3/12.
 */

var crypto = require("crypto");
var bcrypt = require("bcrypt");

var should = require("should");
var app = require("../../app");
var mongoose = require("mongoose");
var User = require("../../app/models/user");

function getRandomString(len){
    if(!len) len = 16;

    return crypto.randomBytes(Math.ceil(len/2).toString("hex"));
};

// 编写测试用例
descripe("<Unit Test",function(){
    descripe("Model User:",function(){
        before(function(done){
            user = {
                name: getRandomString(),
                password: "password"
            };
            done();
        });

        descripe("Before Method save",function(){})
    })
});