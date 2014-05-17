"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , supplier = require('../modules/mod_supplier.js');


exports.update = function (handler, callback) {

  var uid = handler.uid
    , code = handler.code
    , supplierId = handler.params.supplierId;
  var params = handler.params;
  var data = {
    supplierNum   : params.supplierNum   ,
    supplierName  : params.supplierName  ,
    editat : new Date()
  };

  supplier.update(code, supplierId, data, function (err, result) {
    return callback(err, result);
  });
}

exports.remove = function (handler, callback) {

  var uid = handler.uid
    , code = handler.code
    , supplierId = handler.params.supplierId;

  supplier.remove(code,uid, supplierId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.get = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , supplierId = handler.params.supplierId;

  supplier.get(code, supplierId, function(err, result) {
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
    supplierNum   : params.supplierNum   ,
    supplierName  : params.supplierName  ,
    supplierPhone : params.supplierPhone ,
    createat : new Date() ,
    editat : new Date()
  };

  supplier.add(code,data,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {valid: 1};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  supplier.getList(code, condition, start, count, function (err, result) {

    supplier.total(code,condition,function(err1,totalItems) {
      return callback(err, {items:result,totalItems:totalItems});
    });
  });
}