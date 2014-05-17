var response = smart.framework.response
  , errors = smart.framework.errors
  , util = smart.framework.util
  , context = smart.framework.context
  , log = smart.framework.log
  , _ = smart.util.underscore
  , room = require('../controllers/ctrl_room');


// 获取App  的台位 一览
exports.getRoom = function (req, res) {

  var handler = new context().bind(req, res);
  room.get(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.roomList = function (req, res) {

  var handler = new context().bind(req, res);

  room.list(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.roomAdd = function (req, res) {

  var handler = new context().bind(req, res);
  room.add(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.deleteRoom = function (req, res) {

  var handler = new context().bind(req, res);
  room.remove(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.roomUpdate = function (req, res) {
  var handler = new context().bind(req, res);
  room.update(handler, function (err, result) {
    response.send(res, err, result);
  });
};

