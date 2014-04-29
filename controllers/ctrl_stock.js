"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , moment    = smart.util.moment
  , product = require('../controllers/ctrl_product.js')
  , stock = require('../modules/mod_stock.js')
  , stocktake = require('../modules/mod_stocktake.js')
  , takedetail = require('../modules/mod_takedetail.js');


exports.getTakeDetailList = function(handler, callback) {
  var code = handler.code;
  var params = handler.params;
  var condition = {};
  var start = params.start;
  var count = params.count;

  takedetail.getList(code, condition, start, count, function(err, result) {
    takedetail.total(code, condition, function (err, total) {
      return callback(err, {items: result, totalItems: total});
    });
  });
};


exports.getTakeHistoryList = function(handler, callback) {
  var code = handler.code;
  var params = handler.params;
  var condition = {};
  var start = params.start;
  var count = params.count;

  stocktake.getList(code, condition, start, count, function(err, result) {
    stocktake.total(code, condition, function (err, total) {
      return callback(err, {items: result, totalItems: total});
    });
  });
}

exports.addTake = function(handler, callback) {
  var code = handler.code;

  var params = handler.params;
  var type = params.type;
  var takeList = params.takeList;
  var tips = params.tips;

  //存在今天的记录

  console.log(new Date());

  var newStocktake = {
    today : moment().format("YYYY-MM-DD"),
    tips : tips,
    status : 1,
    type : type,
    createat : new Date(),
    createby : handler.uid,
    editat : new Date(),
    editby : handler.uid
  };

  stocktake.has(code,moment().format("YYYY-MM-DD"),type,function(err, result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (result) {
      return callback(null,{systemError : "已存在"});
    }

    stocktake.add(code,newStocktake,function(err,result){

      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (!result) {
        return callback(null);
      }

      async.each(takeList,function(tk, cb){

        stock.get(code,tk.stockId,function(err,resultStock){
          handler.addParams("productId",resultStock.productId);

          product.get(handler,function(err, resultProduct) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log(resultProduct);
            console.log(resultProduct._doc.unit.unitName);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            var newDetail = {
              takeId          : result._id
              , stockId         : tk.stockId
              , amount          : tk.takeValue
              , type            : type
              , productId       : resultStock.productId
              , productSN       : resultProduct.productSN
              , productName     : resultProduct.productName
              , productUnit     : resultProduct._doc.unit.unitName
              , productRoom     : resultProduct._doc.room.roomName
              , productCategory : resultProduct._doc.category.name
              , original        : 0
              , status          : 1

              , valid           : 1

              , createat        : new Date()
              , createby        : handler.uid
              , editat          : new Date()
              , editby          : handler.uid
            };
            takedetail.add(code,newDetail , function(){
              cb(null);
            });
          });
        });

      },function(err, results){
        console.log("ok");
        return callback(err, result);
      })

    })
  });
};

exports.getTakeList = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;
  var type = params.type;
  var today = new Date();
  var condition = {
    type : type
  };

  stocktake.has(code,moment().format("YYYY-MM-DD"),type,function(err, result){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (result) {
      return callback(null,{systemMessage : "已存在" ,items: []});
    }

    stock.getList(code, condition, 0, Number.MAX_VALUE, function (err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (!result) {
        return callback(null, {items: []});
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

        product.get(handler,function(err, resultProduct) {

          stockList[resultStock._doc.index_] = resultStock;
          stockList[resultStock._doc.index_]._doc.product = resultProduct;
          return cb(null);
        });
      }, function (err, result) {

        return callback(err, {items: stockList});
      });
    });
  });

};

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