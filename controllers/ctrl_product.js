"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , ctrlUser    = smart.ctrl.user
  , context   = smart.framework.context
  , product = require('../modules/mod_product.js')
  , category = require('../modules/mod_category.js')
  , unit = require('../modules/mod_unit.js')
  , room = require('../modules/mod_room.js')
  , supplier = require('../modules/mod_supplier.js');

function getProduct(code, productId, callback) {
  console.log(productId);
  product.get(code, productId, function (err, result) {
    console.log(result);
    async.parallel({
      category: function (callback) {

        category.get(code, result.categoryId, function (err, resultCategory) {
          callback(null, resultCategory);
        });
      },
      unit: function (callback) {
        unit.get(code, result.unitId, function (err, resultUnit) {
          callback(null, resultUnit);
        });
      },
      room: function (callback) {
        room.get(code, result.roomId, function (err, resultRoom) {
          callback(null, resultRoom);
        });
      },
      supplier: function (callback) {
        supplier.get(code, result.supplierId, function (err, resultSupplier) {
          callback(null, resultSupplier);
        });
      },
      user :function(callback){
        var handler = new context().create();
        handler.addParams("uid", result.createby);
        ctrlUser.get(handler,function(err, resultUser){
          callback(null, resultUser);
        });
      }

    }, function (err, results) {
      result._doc.category = results.category;
      result._doc.unit = results.unit;
      result._doc.room = results.room;
      result._doc.supplier = results.supplier;
      result._doc.user = results.user;
      console.log(result);
      callback(err, result);
    });
  });
}

exports.get = function(handler ,callback) {
  var code = handler.code;
  var params = handler.params;
  var productId = params.productId;
  getProduct(code, productId, function(err, result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (!result) {
      return callback(new error.NotFound("不存在"));
    }

    return callback(null,result);
  });
}

exports.add = function (handler, callback) {
  var code = handler.code;
  var condition = {};
  var params = handler.params;

  var productData = {
    productName         : params.productName,
    productSN           : params.productSN,

    categoryId          : params.productCategoryId ,
    unitId              : params.productUnitId ,
    roomId              : params.productRoomId ,
    supplierId          : params.productSupplierId ,

    productCode         : params.productCode,
    productPrice        : params.productPrice,
    productDescription  : params.productDescription,

    createat: new Date(),
    createby: handler.uid,
    editat: new Date(),
    editby: handler.uid
  };

  product.add(code,productData,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;

  if (params.categoryId) {
    condition.categoryId = params.categoryId;
  }
  if (params.ids) {
    console.log(params.ids);

    condition._id = {$in:params.ids.split(",")};
  }

  var start = params.start;
  var count = params.count;

  var productList = [];
  product.getList(code, condition, start, count, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (!result) {
      return callback(null, {items: [], totalItems: 0});
    }

    for (var i in result) {
      result[i]._doc.index_ = i;
    }

    console.log(result);

    async.each(result,
      function (obj, cb) {
        getProduct(code, result[obj._doc.index_]._id, function (err, productDocs) {
          productList[obj._doc.index_] = productDocs;
          cb(null);
        });
      },
      function (err, result) {

        product.total(code,condition,function(err,total){

          if (err) {
            return callback(new error.InternalServer(err));
          }

          return callback(err, {items: productList,totalItems:total});
        });
      }
    );
  });
}