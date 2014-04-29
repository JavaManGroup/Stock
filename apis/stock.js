var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = smart.util.underscore
  , stock   = require('../controllers/ctrl_stock');


exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  stock.list(handler,function(err, result){
    response.send(res, err, result);
  });
};

exports.addStock = function(req, res) {

  var handler = new context().bind(req, res);
  stock.addStock(handler ,function(err ,result) {
    response.send(res, err, result);
  });
};
