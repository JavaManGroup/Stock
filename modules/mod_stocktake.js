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
var Stocktake = new schema({
    amount          :   { type: Number, description: "编号" }
  , type            :   { type: Number, description: "盘点类型  1 日盘 2  月盘  3 季盘  4" }
  , today           :   { type: String, description: "今天日期" }
  , num             :   { type: String, description: "编号" }
  , tips            :   { type: String, description: "" }
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
  return conn.model(dbname, "Stocktake", Stocktake);
}


exports.has = function(code, today, type , callback){
  var stocktake = model(code);
  stocktake.findOne({today:today ,type : type , valid : 1},function(err, result) {
    callback(err, result);
  });
}
/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newStocktake, callback) {

  var stocktake = model(code);

  new stocktake(newStocktake).save(function(err, result) {
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
exports.update = function(code, stocktakeId, newStocktake, callback) {

  var stocktake = model(code);

  stocktake.findByIdAndUpdate(stocktakeId, newStocktake, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, stocktakeId, callback) {

  var stocktake = model(code);

  stocktake.findOne({_id: stocktakeId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, stocktakeId, callback) {

  var stocktake = model(code);

  stocktake.findByIdAndUpdate(stocktakeId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
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

  var stocktake = model(code);

  stocktake.find(condition)
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

  var stocktake = model(code);

  stocktake.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};