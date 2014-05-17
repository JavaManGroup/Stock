var response = smart.framework.response
  , errors = smart.framework.errors
  , util = smart.framework.util
  , context = smart.framework.context
  , log = smart.framework.log
  , _ = smart.util.underscore
  , stock = require('../controllers/ctrl_stock');

exports.updateStock = function (req, res) {

  var handler = new context().bind(req, res);
  stock.updateStock(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.addTakeDetail = function (req, res) {

  var handler = new context().bind(req, res);
  stock.addTakeDetail(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.updateTakeValue = function (req, res) {

  var handler = new context().bind(req, res);
  stock.updateTakeValue(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.getTakeDetailList = function (req, res) {

  var handler = new context().bind(req, res);
  stock.getTakeDetailList(handler, function (err, result) {
    response.send(res, err, result);
  });
};


exports.getTakeHistoryList = function (req, res) {

  var handler = new context().bind(req, res);
  stock.getTakeHistoryList(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.addTake = function (req, res) {

  var handler = new context().bind(req, res);
  stock.addTake(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.getTakeList = function (req, res) {

  var handler = new context().bind(req, res);
  stock.getTakeList(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.list = function (req, res) {

  var handler = new context().bind(req, res);
  stock.list(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.addStock = function (req, res) {

  var handler = new context().bind(req, res);
  stock.addStock(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.removeStock = function (req, res) {

  var handler = new context().bind(req, res);
  stock.removeStock(handler, function (err, result) {
    response.send(res, err, result);
  });
};