/**
 * @file 存取菜品信息的module
 * @author xiangrui.zeng@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 菜品的schema
 * @type {schema}
 */
var Takedetail = new schema({

    takeId          :   { type: String, description: "编号" ,index :true }
  , stockId         :   { type: String, description: "编号" ,index :true }
  , stockTips       :   [String]
  , amount          :   { type: Number, description: "数量" }
  , type            :   { type: Number, description: "类型" ,index :true}
  , productId       :   { type: String, description: "产品编号" ,index :true }
  , productSN     :   { type: String, description: "产品名称" }
  , productName     :   { type: String, description: "产品名称" }
  , productUnit     :   { type: String, description: "单位" }
  , productRoom     :   { type: String, description: "库房" }
  , productCategory :   { type: String, description: "类型" }
  , original        :   { type: Number, description: "原数" }
  , adjustment      :   { type: Number, description: "调整数值" }

  , status          :   { type: Number, description: "盘点类型  1 提交未审核 2 提交已审核  3 取下修改" }

  , valid           :   { type: Number, description: "产品名称" , default:1 }

  , createat        :   { type: Date,   description: "创建时间" }
  , createby        :   { type: String, description: "创建者" }
  , editat          :   { type: Date,   description: "最终修改时间" }
  , editby          :   { type: String, description: "最终修改者" }
});

/**
 * 使用定义好的Schema,通过Code生成Item的model
 * @param {string} code
 * @returns {model} item model
 */
function model(dbname) {
  return conn.model(dbname, "Takedetail", Takedetail);
}


exports.hasProduct = function(code, productId, type , callback){
  var takedetail = model(code);
  takedetail.findOne({productId:productId ,type : type , valid : 1},function(err, result) {
    callback(err, result);
  });
}
/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newTakedetail, callback) {

  var takedetail = model(code);

  new takedetail(newTakedetail).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新指定素材
 * @param {string} code 公司code
 * @param {string} itemId菜品ID
 * @param {object} conditions 更新条件
 * @param {function} callback 返回菜品更新结果
 */
exports.update = function(code, takedetailId, newTakedetail, callback) {

  var takedetail = model(code);

  takedetail.findByIdAndUpdate(takedetailId, newTakedetail, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, takedetailId, callback) {

  var takedetail = model(code);

  takedetail.findOne({_id: takedetailId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, takedetailId, callback) {

  var takedetail = model(code);

  takedetail.findByIdAndUpdate(takedetailId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

exports.getOriginalByProductId = function (code, productId, callback) {

  var takedetail = model(code);

  takedetail.find({productId:productId})
    .skip(0)
    .limit(1)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

exports.getOriginal = function (code, productId, type, stockId, callback) {

  var takedetail = model(code);
  takedetail.find({stockId: stockId , productId:productId ,type:type})
    .skip(0)
    .limit(1)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取素材一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {number} start 数据开始位置
 * @param {number} limit 数据件数
 * @param {function} callback 返回一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var takedetail = model(code);

  takedetail.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取素材件数
 * @param {string} code 公司Code
 * @param {object} condition 条件
 * @param {function} callback 返回件数
 */
exports.total = function(code, condition, callback) {

  var takedetail = model(code);

  takedetail.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};