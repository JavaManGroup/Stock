/**
 * @file 布局作成工具类，计算布局的大小等共同方法
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var topOffset = 1;     // 页顶部偏移1px
var bottomOffset = 1;  // 页底部偏移1px
var coverW = 340;      // 一格的宽度
var coverH = 239;      // 一格的高度
var rows = 3;           // 九宫格的行数必需是3
var cols = 3;           // 九宫格的列数必需是3
var border = 2;         // 九宫格内边框的Size 2px

// 每行的x,y,width,height的映射表，因为固定三行三列，所以用如下固定的写法。
var xMap = [0, border + coverW, 2*(border + coverW)];
var yMap = [0, border + coverH, 2*(border + coverH)];
var wMap = [coverW, border + 2*coverW, 2*border + 3*coverW];
var hMap = [coverH, border + 2*coverH, 2*border + 3*coverH];

/**
 * 转换指定page和tile的Area信息
 * @param page_index
 * @param tile
 * @returns {{x: number, y: number, w: number, h: number}}
 */
exports.covertToArea = function(tile){
  var pageIndex = Math.ceil(tile.num / 9) -1;      // 当前页索引
  var num = tile.num - pageIndex * 9;              // 当前页内的num
  var top = pageIndex * exports.getLayoutHeight() + topOffset;   // 当前页的top
  var row = Math.ceil(num / cols) - 1;              // tile在当前页的行索引
  var col = num - row * cols - 1;                   // tile在当前页的列索引

  return {
    x: xMap[col],
    y: yMap[row] + top,
    w: wMap[tile.colspan -1],
    h: hMap[tile.rowspan -1]
  };
};

/**
 *  转换指定 CaseMenu item 的Area信息
 * @param itemIndex
 * @returns {{x: number, y: number, w: number, h: number}}
 */
exports.covertToAreaForCaseMenu = function(itemIndex){
  return {
    x: itemIndex * exports.getCaseMenuItemWidth(),
    y: 0,
    w: exports.getCaseMenuItemWidth(),
    h: exports.getCaseMenuItemHeight()
  };
};

/**
 * 拆分合并的tile,将tile的数据保存到map中
 * @param tile
 * @param map
 * @param tileData
 */
exports.splitTileToMap = function(tile, map, tileData) {
  var list = exports.splitTileNum(tile);
  for(var index in list) {
    var num = list[index];
    map[num] = tileData;
  }
};

/**
 * 拆分合并的tile,返回num的数组
 * @param tile
 * @returns {Array}
 */
exports.splitTileNum = function(tile) {
  var list = [];
  //var row = Math.ceil(tile.num / cols) - 1;              // tile的行索引
  //var col = tile.num - row * cols - 1;                   // tile的列索引

  //log.out("info", "==== tile.num: " + tile.num + " ; rowspan: " + tile.rowspan + " ; colspan: " + tile.colspan);
  for(var i = 0; i < tile.rowspan; i++) {
    for(var j = 0; j < tile.colspan; j++) {
      var num = tile.num + i * cols + j;

      //log.out("info", "--- num:" + " ; num:" + num);
      list.push(num);
    }
  }

  return list;
};

/**
 * 取得一页Layout的宽度
 * @returns {*}
 */
exports.getLayoutWidth = function() {
  return wMap[2];
};

/**
 * 取得一页Layout的高度
 * @returns {*}
 */
exports.getLayoutHeight = function() {
  return hMap[2] + topOffset + bottomOffset;
};

/**
 * 取得 CaseMenu item 的宽度
 * @returns {*}
 */
exports.getCaseMenuItemWidth = function() {
  return 106;
};

/**
 * 取得 CaseMenu item 的高度
 * @returns {number}
 */
exports.getCaseMenuItemHeight = function() {
  return 84;
};

