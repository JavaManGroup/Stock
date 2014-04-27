"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , category = require('../modules/mod_category.js');



exports.add = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;

  var data = {
    name : params.categoryName
  };

  category.add(code,data,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  category.getList(code, condition, start, count, function (err, result) {

    return callback(err, {items:result});
  });
}