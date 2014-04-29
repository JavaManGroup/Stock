"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , product = require('../controllers/ctrl_product.js')
  , stock = require('../modules/mod_stock.js');

function addStock(code, type, productId, callback) {

  //判断是否存在
  stock.hasProduct(code, productId, type, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (result) {
      return callback(null, result);
    }
    var data = {
      productId: productId,
      type: type
    }
    stock.add(code, data, function (err, result1) {

      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (!result) {
        return callback(null, {});
      }

      return callback(err, result1);
    });
  });
};

exports.addStock = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;
  var type = params.type;
  var stockIds = params.stockIds;

  async.each(stockIds, function (id, cb) {

    addStock(code, type, id, function (err, id) {
      console.log(err);
      console.log(id);
      return cb(null, id);
    });
  }, function (err, result) {

    return callback(err, result);
  });
};


exports.list = function (handler, callback) {
  var code = handler.code;
  var params = handler.params;
  var condition = {};
  var start = params.start;
  var count = params.count;

  var type = params.type;
  if (type) {
    condition.type = type;
  }


  stock.total(code, condition, function (err, total) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (!total) {
      return callback(null, {items: [], totalItems: 0});
    }

    stock.getList(code, condition, start, count, function (err, result) {

      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (!result) {
        return callback(null, {items: [], totalItems: 0});
      }

      var stockList = [];

      for (var i in result) {

        result[i]._doc.index_ = i;
      }

      async.each(result, function (resultStock, cb) {

        if (err) {
          return callback(new error.InternalServer(err));
        }

        handler.addParams("productId",resultStock.productId);

        product.get(handler,function(err, result) {

          stockList[resultStock._doc.index_] = {};
          stockList[resultStock._doc.index_].product = result;
          return cb(null);
        });
      }, function (err, result) {

        return callback(err, {items: stockList, totalItems: total});
      });
    });
  });
}