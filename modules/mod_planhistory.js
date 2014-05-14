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
var Planhistory = new schema({
    num             :   { type: Number, description: "编号" }
  , date            :   { type: String, description: "用户输入的日期" }
  , historyTips     :   [String]
  , planCost: [
    {
      supplierName: { type: String, description: "供应商名称" },
      supplierId:  { type: String, description: "供应商编号" },
      supplierCost: { type: Number, description: "供应商录入价格" }
    }
  ]
  , planMoneyAmount :   { type: Number, description: "今日订单总钱数" , default:1 }
  , status          :   { type: Number, description: "产品名称 1 准备状态  2 提交状态 3 取下状态 " , default:1 }
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
  return conn.model(dbname, "Planhistory", Planhistory);
}


exports.has = function(code, date , callback){
  var planhistory = model(code);
  planhistory.findOne({date:date  , valid : 1},function(err, result) {
    callback(err, result);
  });
}
/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newPlanhistory, callback) {

  var planhistory = model(code);

  new planhistory(newPlanhistory).save(function(err, result) {
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
exports.update = function(code, planhistoryId, newPlanhistory, callback) {

  var planhistory = model(code);

  planhistory.findByIdAndUpdate(planhistoryId, newPlanhistory, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, planhistoryId, callback) {

  var planhistory = model(code);

  planhistory.findOne({_id: planhistoryId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, planhistoryId, callback) {

  var planhistory = model(code);

  planhistory.findByIdAndUpdate(planhistoryId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
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

  var planhistory = model(code);

  planhistory.find(condition)
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

  var planhistory = model(code);

  planhistory.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};