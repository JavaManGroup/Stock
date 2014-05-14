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
var Plantoday = new schema({
    productId       :   { type: String, description: "编号" , index :true }
  , amount          :   { type: Number, description: "编号" }
  , num             :   { type: Number, description: "编号" }
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
  return conn.model(dbname, "Plantoday", Plantoday);
}


exports.has = function(code, productId , callback){
  var plantoday = model(code);
  plantoday.findOne({productId:productId  , valid : 1},function(err, result) {
    callback(err, result);
  });
}
/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newPlantoday, callback) {

  var plantoday = model(code);

  new plantoday(newPlantoday).save(function(err, result) {
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
exports.update = function(code, plantodayId, newPlantoday, callback) {

  var plantoday = model(code);

  plantoday.findByIdAndUpdate(plantodayId, newPlantoday, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, plantodayId, callback) {

  var plantoday = model(code);

  plantoday.findOne({_id: plantodayId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, plantodayId, callback) {

  var plantoday = model(code);

  plantoday.findByIdAndUpdate(plantodayId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
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

  var plantoday = model(code);

  plantoday.find(condition)
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

  var plantoday = model(code);

  plantoday.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};