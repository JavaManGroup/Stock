"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , ctrlUser    = smart.ctrl.user
  , context   = smart.framework.context
  , datastore = smart.ctrl.datastore
  , product = require('../modules/mod_product.js')
  , stock = require('../modules/mod_stock.js')
  , category = require('../modules/mod_category.js')
  , unit = require('../modules/mod_unit.js')
  , room = require('../modules/mod_room.js')
  , takedetail = require('../modules/mod_takedetail.js')
  , supplier = require('../modules/mod_supplier.js');




function getProduct(handler, productId, callback) {

  var code = handler.code;
  var uid  = handler.uid;
  var lang = handler.lang;

  product.get(code, productId, function (err, result) {
    async.parallel({
      category: function (callback) {

        category.get(code, result.categoryId, function (err, resultCategory) {
          callback(null, resultCategory);
        });
      },
      unit: function (callback) {


        var unitHandler = new context().create(uid, code, lang);
        unitHandler.addParams("appName", "Stock");
        unitHandler.addParams("schemaName", "unit");
        unitHandler.addParams("boardName", "get");
        unitHandler.addParams("_id", result.unitId);

        datastore.getOne(unitHandler, function (err, resultUnit) {
          callback(null, resultUnit);
        });
      },
      room: function (callback) {

        var roomHandler = new context().create(uid, code, lang);
        roomHandler.addParams("appName", "Stock");
        roomHandler.addParams("schemaName", "room");
        roomHandler.addParams("boardName", "get");
        roomHandler.addParams("_id", result.roomId);

        datastore.getOne(roomHandler, function (err, resultRoom) {
          callback(null, resultRoom);
        });
      },
      supplier: function (callback) {


        var supplierHandler = new context().create(uid, code, lang);
        supplierHandler.addParams("appName", "Stock");
        supplierHandler.addParams("schemaName", "supplier");
        supplierHandler.addParams("boardName", "get");
        supplierHandler.addParams("_id", result.supplierId);

        datastore.getOne(supplierHandler, function (err, resultSupplier) {
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
      callback(err, result);
    });
  });
}

exports.remove = function(handler ,callback) {
  var code = handler.code;

  var params = handler.params;
  var productId = params.productId;

  product.remove(code,productId ,function(err, result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    return callback(null,result);
  });
}

exports.update = function(handler ,callback) {
  var code = handler.code;

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

    valid               : 1,

    createat: new Date(),
    createby: handler.uid,
    editat: new Date(),
    editby: handler.uid
  };
  var productId = params.productId;

  product.update(code,productId,productData ,function(err,result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    return callback(null,result);
  });

}

exports.get = function(handler ,callback) {

  var params = handler.params;
  var productId = params.productId;
  getProduct(handler, productId, function(err, result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (!result) {
      return callback(new error.NotFound("不存在"));
    }

    return callback(null,result);
  });
};

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

    valid               : 1,

    createat: new Date(),
    createby: handler.uid,
    editat: new Date(),
    editby: handler.uid
  };

  product.add(code,productData,function(err, result){
    return callback(err, result);
  });
};

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {
    valid : 1
  };
  var params = handler.params;

  if (params.categoryId) {
    condition.categoryId = params.categoryId;
  }
  if (params.ids) {
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

    async.each(result,

      function (obj, cb) {

        getProduct(handler, result[obj._doc.index_]._id, function (err, productDocs) {

          takedetail.getOriginalByProductId(code,productDocs._id,function(err,original){
            productList[obj._doc.index_] = productDocs;

            if (original[0] && original[0].adjustment) {

              productList[obj._doc.index_]._doc.originalAmount = original[0].adjustment
            } else if (original[0]) {

              productList[obj._doc.index_]._doc.originalAmount = original[0].amount || 0;
            }

            stock.getByProductId(code, productDocs._id, function (err, stockDocs) {

              if (stockDocs) {

                if(stockDocs.lower){

                  productList[obj._doc.index_]._doc.lower = stockDocs.lower || 0;
                }
                cb(null);

              } else {

                cb(null);
              }
            });
          });
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
};