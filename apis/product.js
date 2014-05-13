var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = smart.util.underscore
  , product   = require('../controllers/ctrl_product');


exports.removeProduct = function(req, res) {

  var handler = new context().bind(req, res);

  product.remove(handler , function(err, result) {
    response.send(res, err, result);
  });
}

exports.updateProduct = function(req, res) {

  var handler = new context().bind(req, res);

  product.update(handler , function(err, result) {
    response.send(res, err, result);
  });
}

exports.getProduct = function(req, res) {

  var handler = new context().bind(req, res);

  product.get(handler , function(err, result) {
    response.send(res, err, result);
  });
};

// 获取App  的台位 一览
exports.productList = function(req, res) {

  var handler = new context().bind(req, res);

  product.list(handler , function(err, result) {
    response.send(res, err, result);
  });
};

exports.productAdd = function(req, res) {

  var handler = new context().bind(req, res);
  product.add(handler , function(err, result) {
    response.send(res, err, result);
  });
};

