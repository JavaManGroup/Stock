var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = smart.util.underscore
  , unit   = require('../controllers/ctrl_unit');


// 获取App  的台位 一览
exports.getUnit = function(req, res) {

  var handler = new context().bind(req, res);
  unit.get(handler ,function(err ,result) {
    response.send(res, err, result);
  });
};

exports.unitList = function(req, res) {

  var handler = new context().bind(req, res);

  unit.list(handler , function(err, result) {
    response.send(res, err, result);
  });
};

exports.unitAdd = function(req, res) {

  var handler = new context().bind(req, res);
  unit.add(handler , function(err, result) {
    response.send(res, err, result);
  });

};
exports.deleteUnit = function(req, res) {

  var handler = new context().bind(req, res);
  unit.remove(handler , function(err, result) {
    response.send(res, err, result);
  });
};

exports.unitUpdate = function(req, res) {
  var handler = new context().bind(req, res);
  unit.update(handler , function(err, result) {
    response.send(res, err, result);
  });
};

