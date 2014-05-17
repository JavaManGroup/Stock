var response = smart.framework.response
  , errors = smart.framework.errors
  , util = smart.framework.util
  , context = smart.framework.context
  , log = smart.framework.log
  , _ = smart.util.underscore
  , supplier = require('../controllers/ctrl_supplier');


// 获取App  的台位 一览
exports.getSupplier = function (req, res) {

  var handler = new context().bind(req, res);

  supplier.get(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.supplierList = function (req, res) {

  var handler = new context().bind(req, res);

  supplier.list(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.supplierAdd = function (req, res) {

  var handler = new context().bind(req, res);

  supplier.add(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.deleteSupplier = function (req, res) {

  var handler = new context().bind(req, res);

  supplier.remove(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.supplierUpdate = function (req, res) {

  var handler = new context().bind(req, res);

  supplier.update(handler, function (err, result) {
    response.send(res, err, result);
  });
};

