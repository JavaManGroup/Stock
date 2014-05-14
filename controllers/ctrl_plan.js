"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , ctrlStock = require('../controllers/ctrl_stock.js')
  , plancatalog = require('../modules/mod_plancatalog')
  , planhistory = require('../modules/mod_planhistory')
  , plandetail = require('../modules/mod_plandetail')
  , product = require('../controllers/ctrl_product');


exports.removePlanDetail = function (handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var plandetailId = params.plandetailId;

  plandetail.remove(code, handler.uid, plandetailId, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }
    return callback(err, result);
  });
};

exports.updatePlanDetail = function (handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var plandetailId = params.plandetailId;
  var planAmount = params.planAmount;
  var data = {};

  if (planAmount) {
    data = {
      planAmount: planAmount
    }
  }

  plandetail.update(code, plandetailId, data, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }
    return callback(err, result);
  });
};

exports.getPlanHistory = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var historyId = params.historyId;

  planhistory.get(code, historyId, function (err, result) {

    plandetail.total(code, {historyId: historyId, valid: 1}, function (err, totalItems) {

      result._doc.totalDetail = totalItems;
      callback(err, result);
    });
  });
};

exports.updatePlanHistory = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var historyId = params.historyId;
  var supplierId = params.supplierId;
  var supplierName = params.supplierName || "";
  var supplierCost = params.supplierCost;

  var status = params.status;

  var data = {};

  if (supplierId) {

    data = {
      $push: {"planCost": {
        supplierName:supplierName,
        supplierId: supplierId,
        supplierCost:supplierCost
      }}
    };
  }

  if (status) {
    data = {
      status : status
    };
  }

  planhistory.update(code,historyId,data,function(err,result){

    if (err) {
      return callback(new error.InternalServer(err));
    }
    return callback(err,result);
  });
};

exports.addPlanDetail = function (handler, callback) {

  var code = handler.code;
  var params = handler.params;

  handler.addParams("productId", params.productId);

  product.get(handler,function(err, resultProduct){

    var newDetail = {
      historyId: params.historyId,
      planAmount : params.planAmount,

      productAmount: resultProduct.product,
      productSN: resultProduct.productSN,
      productName: resultProduct.productName,
      productCategory: resultProduct._doc.category.name,
      productUnit: resultProduct._doc.unit.unitName,
      productRoom: resultProduct._doc.room.roomName,
      productSupplier : resultProduct._doc.supplier.supplierName,
      supplierPhone : resultProduct._doc.supplier.supplierPhone,
      productPrice: resultProduct.productPrice,
      createat: new Date(),
      createby: handler.uid,
      editat: new Date(),
      editby: handler.uid
    };

    plandetail.add(code, newDetail, function (err, result) {
      console.log(err);
      return callback(err, result);
    });
  });
};

exports.getPlanDetailList = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;
  var start = params.start;
  var count = params.count;

  var historyId = params.historyId;

  var condition = {
    valid: 1 ,
    historyId : historyId
  };

  plandetail.getList(code, condition, start, count, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    plandetail.total(code, condition, function (err, totalItems) {

      return callback(err, {items: result, totalItems: totalItems});
    });
  });
};


exports.getPlanHistoryList = function (handler, callback) {

  var code = handler.code;
  var condition = {
    valid: 1
  };
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  planhistory.getList(code, condition, start, count, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    planhistory.total(code,condition,function(err, totalItems){

      var tmpList = [];

      for (var i in result) {
        result[i]._doc._index_ = i;
      }

      async.each(result,function(itHistory,cb){

        plandetail.total(code, {historyId: itHistory._id, valid: 1}, function (err, totalPlandetail) {

          tmpList[itHistory._doc._index_] = itHistory;
          tmpList[itHistory._doc._index_]._doc.totalPlandetail = totalPlandetail;
          return cb(null);
        });
      },function(err){

        return callback(err, {items: tmpList, totalItems: totalItems});
      });
    });
  });
};

exports.addPlanHistory = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;

  var newHistory = {
    date: params.date,
    createat: new Date(),
    createby: handler.uid,
    editat: new Date(),
    editby: handler.uid
  };

  planhistory.has(code,params.date,function(err, has){

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (has) {
      return callback(null, { systemError: "已存在这一天的计划。"});
    }

    planhistory.add(code, newHistory, function (err, result) {

      if (err) {
        return callback(new error.InternalServer(err));
      }

      handler.addParams("type",1);
      handler.addParams("all","all");

      ctrlStock.getTakeList(handler,function(err, resultTakeList){
         var list = resultTakeList.items;
        async.each(list, function (itStock, cb) {

            var resultProduct = itStock._doc.product;

            var newDetail = {

              historyId: result._id,
              planAmount : 0,
              productSN: resultProduct.productSN,
              productName: resultProduct.productName,
              productCategory: resultProduct._doc.category.name,
              productUnit: resultProduct._doc.unit.unitName,
              productRoom: resultProduct._doc.room.roomName,
              productSupplier : resultProduct._doc.supplier.supplierName,
              supplierPhone : resultProduct._doc.supplier.supplierPhone,
              productPrice: resultProduct.productPrice,
              createat: new Date(),
              createby: handler.uid,
              editat: new Date(),
              editby: handler.uid
            };

          if((itStock._doc.originalAmount - itStock.lower) < 0 ){
            newDetail.planAmount = itStock.lower - itStock._doc.originalAmount;

            plandetail.add(code, newDetail, function (err, result) {

              cb(null);
            });
          } else {
            cb(null);
          }

        }, function () {
          return callback(err, result);
        });
      });
    });
  });
};

/**
 * 获得今日盘点的列表。
 * @param req
 * @param res
 */
exports.getPlanTodayList = function (handler, callback) {

  var code = handler.code;
  var condition = {
    valid: 1
  };

  var params = handler.params;
  var start = params.start;
  var count = params.count;

  plancatalog.getList(code, condition, start, count, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    plancatalog.total(code,condition,function(err, totalItems){

      var tmpList = [];

      for (var i in result) {

        result[i]._doc.index_ = i;
      }

      async.each(result, function (resultCatalog, cb) {

        if (err) {
          return callback(new error.InternalServer(err));
        }

        handler.addParams("productId", resultCatalog.productId);

        product.get(handler, function (err, result) {

          tmpList[resultCatalog._doc.index_] = resultCatalog;
          tmpList[resultCatalog._doc.index_]._doc.product = result;
          return cb(null);
        });
      }, function (err, result) {

        return callback(err, {items: tmpList, totalItems: totalItems});
      });

    });
  });
};

function addPlanCatalog(code, type, productId, callback) {

  //判断是否存在
  plancatalog.has(code, productId, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (result) {
      return callback(null, result);
    }

    var data = {
      productId: productId ,
      createat : new Date(),
      editat : new Date()
    };

    plancatalog.add(code, data, function (err, result1) {

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


exports.getPlanCatalogList = function (handler, callback) {

  var code = handler.code;
  var condition = {
    valid: 1
  };
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  plancatalog.total(code, condition, function (err1, totalItems) {

    plancatalog.getList(code, condition, start, count, function (err, result) {

      var stockList = [];

      for (var i in result) {

        result[i]._doc.index_ = i;
      }


      async.each(result, function (resultCatalog, cb) {

        if (err) {
          return callback(new error.InternalServer(err));
        }

        handler.addParams("productId", resultCatalog.productId);

        product.get(handler, function (err, result) {

          stockList[resultCatalog._doc.index_] = resultCatalog;
          stockList[resultCatalog._doc.index_]._doc.product = result;
          return cb(null);
        });
      }, function (err, result) {

        return callback(err, {items: stockList, totalItems: totalItems});
      });

    });
  });
};


exports.addPlanCatalog = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;
  var type = params.type;

  var productIds = params.productIds;

  async.each(productIds, function (id, cb) {

    addPlanCatalog(code, type, id, function (err, id) {
      return cb(null, id);
    });
  }, function (err, result) {

    return callback(err, result);
  });
};

exports.removePlan = function (handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var planId = params.planId;
  var uid = handler.uid;

  plancatalog.remove(code, uid, planId, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    if (!result) {
      return callback(null, {});
    }

    return callback(err, result);
  });
};