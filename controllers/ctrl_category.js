"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , category = require('../modules/mod_category.js')
  , product = require('../modules/mod_product.js');

exports.update = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , categoryId = handler.params.categoryId;
  var params = handler.params;
  var data = {
    name : params.categoryName,
    editat : new Date()
  };

  category.update(code,categoryId,data,function(err,result){
    return callback(err,result);
  });

}

exports.remove = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , categoryId = handler.params.categoryId;

  category.remove(code,uid, categoryId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.get = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , categoryId = handler.params.categoryId;

  category.get(code, categoryId, function(err, result) {
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
    name : params.categoryName,
    createat : new Date() ,
    editat : new Date()
  };

  category.add(code,data,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {valid: 1};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  category.getList(code, condition, start, count, function (err, result) {

    for(var i in result ) {
      result[i]._doc._index_ = i;
    }
    var tmpResultList = [];
    category.total(code,condition,function(err1,totalItems) {

      async.each(result, function (itCategory, cb) {

        product.total(code, {categoryId: itCategory._id, valid: 1}, function (err, totalProduct) {

          tmpResultList[itCategory._doc._index_] = itCategory;
          tmpResultList[itCategory._doc._index_]._doc.productTotal = totalProduct;
          cb(null);
        });

      }, function () {
        return callback(err, {items: tmpResultList, totalItems: totalItems});
      });
    });
  });
}