"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , unit = require('../modules/mod_unit.js');


exports.update = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , unitId = handler.params.unitId;
  var params = handler.params;
  var data = {
    unitNum   : params.unitNum   ,
    unitName  : params.unitName  ,
    unitRadix : params.unitRadix ,
    unitScale : params.unitScale ,
    editat : new Date()
  };

  unit.update(code,unitId,data,function(err,result){
    return callback(err,result);
  });

}

exports.remove = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , unitId = handler.params.unitId;

  unit.remove(code,uid, unitId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.get = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , unitId = handler.params.unitId;

  unit.get(code, unitId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.add = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;

  var data = {
    unitNum   : params.unitNum   ,
    unitName  : params.unitName  ,
    unitRadix : params.unitRadix ,
    unitScale : params.unitScale ,
    createat : new Date() ,
    editat : new Date()
  };

  unit.add(code,data,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {valid: 1};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  unit.getList(code, condition, start, count, function (err, result) {

    unit.total(code,condition,function(err1,totalItems) {
      return callback(err, {items:result,totalItems:totalItems});
    });
  });
}