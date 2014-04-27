"use strict";

var _ = smart.util.underscore
  , async = smart.util.async
  , error = smart.framework.errors
  , util = smart.framework.util
  , product = require('../modules/mod_product.js');

//  unitId               :   { type: String, description: "台位ID"}
//, roomId               :   { type: String, description: "服务的Id"}
//, supplierId           :   { type: String, description: "订单序号"}
//, categoryId           :   { type: String, description: "订单组"}
//, productName          :   { type: String, description: "产品名称"}
//, productCode          :   { type: String, description: "产品条码"}
//, productSN            :   { type: String, description: "产品条码"}
//, productPrice         :   { type: String, description: "产品条码"}
//, productDescription   :   { type: String, description: "产品条码"}
//, productCheckType     :   { type: String, description: "名称"}
//, createat             :   { type: Date,   description: "创建时间" }
//, createby             :   { type: String, description: "创建者" }
//, editat               :   { type: Date,   description: "最终修改时间" }
//, editby               :   { type: String, description: "最终修改者" }

exports.add = function (handler, callback) {
  var code = handler.code;
  var condition = {};
  var params = handler.params;

  var productData = {
    productName: params.productName,
    productSN :params.productSN,
    categoryId :params.productCategoryId,
    unitId: params.productUnitId,
    productCode :params.productCode,
    productPrice : params.productPrice,
    productDescription : params.productDescription,
    createat: new Date(),
    createby: handler.uid,
    editat: new Date(),
    editby: handler.uid
  };
  product.add(code,productData,function(err, result){
    return callback(err, result);
  });
}

exports.list = function (handler, callback) {

  var code = handler.code;
  var condition = {};
  var params = handler.params;
  var start = params.start;
  var count = params.count;

  product.getList(code, condition, start, count, function (err, result) {

    return callback(err, {items:result});
  });
}