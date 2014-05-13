"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , moment = smart.util.moment
  , config = smart.util.config
  , product = require('../controllers/ctrl_product.js')
  , stock = require('../modules/mod_stock.js')
  , stocktake = require('../modules/mod_stocktake.js')
  , takedetail = require('../modules/mod_takedetail.js')
  , modProduct = require('../modules/mod_product.js');

exports.updateStock = function(handler, callback) {

  var code      = handler.code;
  var params    = handler.params;
  var stockId   = params.stockId;
  var stockLower = params.stockLower;
  var data = {
    lower : stockLower
  }

  stock.update(code, stockId, data, function (err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    callback(err, result);
  });
};

exports.addTakeDetail = function(handler, callback) {

  var code      = handler.code;
  var params    = handler.params;
  var takeId    = params.takeId;
  var productId = params.productId;
  var takeValue = params.takeValue;
  var stockId   = params.stockId;
  var type      = params.type;
  var takeValue  = params.takeValue;

  handler.addParams("productId",productId);

  product.get(handler,function(err, resultProduct) {
    var newDetail = {
        takeId          : takeId
      , stockId         : stockId
      , amount          : takeValue
      , type            : type
      , productId       : productId
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

    takedetail.getOriginal(code, productId, type, stockId, function (err, resultTakedetail) {

      if (resultTakedetail && resultTakedetail.length > 0) {

        if (resultTakedetail[0].adjustment) {

          newDetail.original = resultTakedetail[0].adjustment;
        } else {

          newDetail.original = resultTakedetail[0].amount;
        }

      } else {
        newDetail.original = 0;
      }
      takedetail.add(code, newDetail, function (err, result) {
        return callback(err, result);
      });
    });
  });
}

exports.updateTakeValue = function(handler, callback) {
  var code = handler.code;
  var params = handler.params;
  var takeId = params.takeId;
  var value = params.value;
  var tipsValue = params.tipsValue;

  var data = {

  };
  if (value) {
    data.adjustment =  value;
  }

  if(tipsValue) {
    data = {
      $push: {"stockTips": tipsValue}
    }
  }

  takedetail.update(code,takeId,data,function(err,result){

    if (err) {
      return callback(new error.InternalServer(err));
    }
    return callback(err,result);
  });

};

exports.getTakeDetailList = function(handler, callback) {
  var code = handler.code;
  var params = handler.params;

  var takeId = params.takeId;
  var category = params.category;

  var filter = params.filter;

  var condition = {
    takeId : takeId
  };

  if (filter && filter == 1) {
    condition.$where = "this.original != this.amount";
  }

  if (filter && filter == 2) {
    condition.adjustment = { $exists:true }
  }

  if (filter && filter == 3) {
    condition.$where = "this.stockTips.length > 0 ";
  }

  if (category && category.length) {

    condition.productCategory = { "$in": category.split(",")};
  }

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
      //获得 品数

      var tmpList = [];
      for (var i in result) {
        result[i]._doc._index_ = i;
      }
      async.each(result, function (itStocktake, cb) {

        takedetail.total(code,{takeId : itStocktake._id},function(err, totalTakeProduct){
          itStocktake._doc.totalTakeProduct = totalTakeProduct;
          tmpList[itStocktake._doc._index_] = itStocktake;
          cb(err,itStocktake);
        });

      }, function (err, results) {
        console.log(results);
        return callback(err, {items: tmpList, totalItems: total});
      });
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
      //TODO : 更新
      var data = {
        $push: {"tips": tips},
        editat: new Date(),
        editby: handler.uid
      };

      stocktake.update(code, result._id, data, function (err, stocktakeResult) {

      });

      async.each(takeList,function(tk, cb){

        handler.addParams("productId",tk.productId);

        product.get(handler,function(err, resultProduct) {
          var newDetail = {
              takeId          : result._id
            , stockId         : tk.stockId
            , amount          : tk.takeValue
            , type            : type
            , productId       : tk.productId
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

          if (tk.stockTips) {

            newDetail.stockTips = tk.stockTips.split();
          }
          //TODO : 去的原数

          takedetail.getOriginal(code, tk.productId, type, tk.stockId, function (err, resultTakedetail) {

            if (resultTakedetail && resultTakedetail.length > 0) {

              if (resultTakedetail[0].adjustment) {

                newDetail.original = resultTakedetail[0].adjustment;
              } else {

                newDetail.original = resultTakedetail[0].amount;
              }

            } else {
              newDetail.original = 0;
            }

            takedetail.add(code, newDetail, function (err, takedetailResult) {

              //TODO: ADD TAKE TODAYLIST
              var data = {
                $push: { "todayList": {
                  "detailId": takedetailResult._id,
                  "productId": resultProduct._id,
                }},
                editat: new Date(),
                editby: handler.uid
              };

              stocktake.update(code, result._id, data, function (err, stocktakeResult) {
                cb(null);
              });
            });
          });
        });

      },function(err, results){
        return callback(err, result);
      });

      return;
    }

    stocktake.add(code,newStocktake,function(err,result){

      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (!result) {


        return callback(null);
      }

      async.each(takeList,function(tk, cb){

          handler.addParams("productId",tk.productId);

          product.get(handler,function(err, resultProduct) {
            var newDetail = {
                takeId          : result._id
              , stockId         : tk.stockId
              , amount          : tk.takeValue
              , type            : type
              , productId       : tk.productId
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

            takedetail.getOriginal(code, tk.productId, type, tk.stockId, function (err, resultTakedetail) {

              if (resultTakedetail && resultTakedetail.length > 0) {

                if (resultTakedetail[0].adjustment) {

                  newDetail.original = resultTakedetail[0].adjustment;
                } else {

                  newDetail.original = resultTakedetail[0].amount;
                }

              } else {
                newDetail.original = 0;
              }

              takedetail.add(code, newDetail, function (err, takedetailResult) {

                var data = {
                  $push: { "todayList": {
                    "detailId": takedetailResult._id,
                    "productId": resultProduct._id,
                  } },
                  editat: new Date(),
                  editby: handler.uid
                };
                stocktake.update(code, result._id, data, function (err, stocktakeResult) {
                  cb(null);
                });
              });
            });
          });

      },function(err, results){
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

  var category = params.category;

  var addProductIndex = function (done) {

    if (category && category.length > 0) {
      var productCondition = {

        categoryId: { "$in": category.split(",")}
      };

      modProduct.getList(code, productCondition, 0, Number.MAX_VALUE, function (err, productResult) {
        var idsIndex = [] ;

        for (var i in productResult) {

          idsIndex.push(productResult[i]._id);
        }

        done(err, idsIndex);
      });
    } else {
      done(null,[]);
    }
  };

  var hasStockTake = function(idsIndex, done) {

    stocktake.has(code, moment().format("YYYY-MM-DD"), type, function (err, hasStockResult) {

      if (err) {
        return callback(new error.InternalServer(err));
      }

      done(err, idsIndex, hasStockResult);
    });

  };

  var getStockList = function(idsIndex, hasStockResult, done){

    var hasTodayList = [];

    if (hasStockResult) {

      hasTodayList = hasStockResult.todayList;
    }

    if (hasTodayList && hasTodayList.length) {

      var ids = [];

      for (var i in hasTodayList) {

        if(hasTodayList[i].productId)
          ids.push(hasTodayList[i].productId);
      }
    }

    if (category && category.length > 0) {

      condition.productId = {"$in":idsIndex};
    }

    var resultStockList = [];

    stock.getList(code, condition, 0, Number.MAX_VALUE, function (err, result) {

      _.each(result, function (stockItem) {

        if (_.indexOf(ids, stockItem.productId) == -1) {
          resultStockList.push(stockItem);
        }
      });
      done(err, resultStockList);
    });
  };


  async.waterfall([addProductIndex, hasStockTake, getStockList], function (err, result) {

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
        //TODO : 获得原数
        takedetail.getOriginal(code,resultStock.productId,resultStock.type,resultStock._id,function(err, resultTakedetail){

          if (resultTakedetail && resultTakedetail.length > 0) {

            if (resultTakedetail[0].adjustment) {

              stockList[resultStock._doc.index_]._doc.originalAmount = resultTakedetail[0].adjustment;
            } else {

              stockList[resultStock._doc.index_]._doc.originalAmount = resultTakedetail[0].amount;
            }

          } else {
            stockList[resultStock._doc.index_]._doc.originalAmount = 0;
          }
          return cb(null);
        });
      });

    }, function (err, result) {

      return callback(err, {items: stockList});
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
      productNId: productId,
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

exports.removeStock = function(handler, callback) {

  var code = handler.code;
  var uid = handler.uid;
  var params = handler.params;
  var stockId = params.stockId;

  stock.remove(code,uid,stockId,function(err, result) {

    if (err) {
      return callback(new error.InternalServer(err));
    }

    return callback(err, result);
  });
};

exports.addStock = function (handler, callback) {

  var code = handler.code;

  var params = handler.params;
  var type = params.type;
  var stockIds = params.stockIds;

  async.each(stockIds, function (id, cb) {

    addStock(code, type, id, function (err, id) {

      return cb(null, id);
    });
  }, function (err, result) {

    return callback(err, result);
  });
};


exports.list = function (handler, callback) {
  var code = handler.code;
  var params = handler.params;
  var condition = {
    valid : 1
  };
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

          stockList[resultStock._doc.index_] = resultStock;
          stockList[resultStock._doc.index_]._doc.product = result;
          takedetail.getOriginal(code, resultStock.productId, resultStock.type, resultStock._id, function (err, resultTakedetail) {

            if (resultTakedetail && resultTakedetail.length > 0) {

              if (resultTakedetail[0].adjustment) {

                stockList[resultStock._doc.index_]._doc.originalAmount = resultTakedetail[0].adjustment;
              } else {

                stockList[resultStock._doc.index_]._doc.originalAmount = resultTakedetail[0].amount;
              }

            } else {
              stockList[resultStock._doc.index_]._doc.originalAmount = 0;
            }
            return cb(null);
          });
        });
      }, function (err, result) {

        return callback(err, {items: stockList, totalItems: total});
      });
    });
  });
};