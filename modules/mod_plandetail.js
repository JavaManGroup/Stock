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
var Plandetail = new schema({
    historyId       :   { type: String, description: "历史记录Id" }
  , productAmount   :   { type: Number, description: "产品数量" }
  , productSN       :   { type: String, description: "产品编号" }
  , productName     :   { type: String, description: "产品名称" }
  , productCategory :   { type: String, description: "产品类型" }
  , productUnit     :   { type: String, description: "产品单位" }
  , productRoom     :   { type: String, description: "产品库房" }
  , productSupplier :   { type: String, description: "产品库房" }
  , supplierPhone   :   { type: String, description: "供应商电话" }
  , productPrice    :   { type: Number, description: "产品单价" }
  , productMoney    :   { type: Number, description: "产品总价" }

  , planAmount      :   { type: Number, description: "计划购买数量" }
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
  return conn.model(dbname, "Plandetail", Plandetail);
}


exports.has = function(code, productId , callback){
  var plandetail = model(code);
  plandetail.findOne({productId:productId  , valid : 1},function(err, result) {
    callback(err, result);
  });
}
/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newPlandetail, callback) {

  var plandetail = model(code);

  new plandetail(newPlandetail).save(function(err, result) {
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
exports.update = function(code, plandetailId, newPlandetail, callback) {

  var plandetail = model(code);

  plandetail.findByIdAndUpdate(plandetailId, newPlandetail, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, plandetailId, callback) {

  var plandetail = model(code);

  plandetail.findOne({_id: plandetailId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, plandetailId, callback) {

  var plandetail = model(code);

  plandetail.findByIdAndUpdate(plandetailId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
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

  var plandetail = model(code);

  plandetail.find(condition)
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

  var plandetail = model(code);

  plandetail.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};