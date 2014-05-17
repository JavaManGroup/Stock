/**
 * @file 存取分类 module
 * @author xiangrui.zeng@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 分类的schema
 * @type {schema}
 */
var Category = new schema({
    name                 :   { type: String, description: "产品名称"}
  , valid                :   { type: Number, description: "产品名称" , default:1}
  , createat             :   { type: Date,   description: "创建时间" }
  , createby             :   { type: String, description: "创建者" }
  , editat               :   { type: Date,   description: "最终修改时间" }
  , editby               :   { type: String, description: "最终修改者" }
});

/**
 * 使用定义好的Schema,通过Code生成Category的model
 * @param {string} code
 * @returns {model} Category model
 */
function model(dbname) {
  return conn.model(dbname, "Category", Category);
}

/**
 * 添加分类
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newCategory, callback) {

  var category = model(code);

  new category(newCategory).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新指定分类
 * @param {string} code 公司code
 * @param {string} categoryId
 * @param {object} newCategory
 * @param {function} callback
 */
exports.update = function(code, categoryId, newCategory, callback) {

  var category = model(code);

  category.findByIdAndUpdate(categoryId, newCategory, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定分类
 * @param {string} code
 * @param {string} newCategory
 * @param {function} callback
 */
exports.get = function(code, categoryId, callback) {

  var category = model(code);

  category.findOne({_id: categoryId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除分类
 * @param {string} code
 * @param {string} uid
 * @param {string} categoryId
 * @param {function} callback
 */
exports.remove = function(code, uid, categoryId, callback) {

  var product = model(code);

  product.findByIdAndUpdate(categoryId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取分类一览
 * @param {string} code 分类code
 * @param {object} condition 条件
 * @param {number} start 数据开始位置
 * @param {number} limit 数据件数
 * @param {function} callback 返回一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var product = model(code);

  product.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取分类件数
 * @param {string} code 公司Code
 * @param {object} condition
 * @param {function} callback
 */
exports.total = function(code, condition, callback) {

  var product = model(code);

  product.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};