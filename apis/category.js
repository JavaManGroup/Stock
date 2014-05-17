var response = smart.framework.response
  , errors = smart.framework.errors
  , util = smart.framework.util
  , context = smart.framework.context
  , log = smart.framework.log
  , _ = smart.util.underscore
  , category = require('../controllers/ctrl_category');


// 获取App  的台位 一览
exports.getCategory = function (req, res) {

  var handler = new context().bind(req, res);
  category.get(handler, function (err, result) {
    response.send(res, err, result);
  });
}

exports.categoryList = function (req, res) {

  var handler = new context().bind(req, res);
  category.list(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.categoryAdd = function (req, res) {

  var handler = new context().bind(req, res);
  category.add(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.deleteCategory = function (req, res) {

  var handler = new context().bind(req, res);
  category.remove(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.categoryUpdate = function (req, res) {
  var handler = new context().bind(req, res);
  category.update(handler, function (err, result) {
    response.send(res, err, result);
  });
};