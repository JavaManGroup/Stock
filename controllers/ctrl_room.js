"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , room = require('../modules/mod_room.js');


exports.update = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , roomId = handler.params.roomId;
  var params = handler.params;
  var data = {
    roomNum   : params.roomNum   ,
    roomName  : params.roomName  ,
    roomRadix : params.roomRadix ,
    roomScale : params.roomScale ,
    editat : new Date()
  };

  room.update(code,roomId,data,function(err,result){
    return callback(err,result);
  });

}

exports.remove = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , roomId = handler.params.roomId;

  room.remove(code,uid, roomId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.get = function (handler, callback) {
  var uid = handler.uid
    , code = handler.code
    , roomId = handler.params.roomId;

  room.get(code, roomId, function(err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
}

exports.add = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;

  var data = {
    roomNum   : params.roomNum   ,
    roomName  : params.roomName  ,
    roomRadix : params.roomRadix ,
    roomScale : params.roomScale ,
    createat : new Date() ,
    editat : new Date()
  };

  room.add(code,data,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {valid: 1};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  room.getList(code, condition, start, count, function (err, result) {

    room.total(code,condition,function(err1,totalItems) {
      return callback(err, {items:result,totalItems:totalItems});
    });
  });
}