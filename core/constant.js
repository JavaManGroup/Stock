/**
 * @file 常量定义类
 * @author sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

/**
 * 共同常量
 */
exports.VALID = 1;
exports.SUPER_ADMIN_USER  = 3;  // 開発者向け、全権限
exports.SYSTEM_ADMIN_USER = 2;  // DA管理者
exports.ADMIN_USER        = 1;  // 顧客管理者
exports.COMMON_USER       = 0;  // 普通のユーザ

/**
 * Controller层用常量
 */
exports.FAKE_PASSWORD = "000000000000000000000";
exports.DEFAULT_SCOPE = "default";

/**
 * Module层用常量
 */
exports.TOTAL_PAGE_DEVICE = 10;

/**
 * ipad 与 web端相互之间下载file使用的常量
 */

//layout.layout.image.imageV
exports.CASE_MENU = "case_menu.png";
//layout.layout.image.imageH
exports.IPAD_MENU = "iPad_menu.png";
//synthetic.Cover[].material.fileId
exports.TOP_MENU = "topmenu";

//imageWithThumb 动画
//metadata[].material.fileId
exports.PIC = "pic";
//metadata[].txtmaterial.fileId
exports.TXT = "txt";

//normal 图集
//metadata[].material.fileId
exports.IMAGE_WITH_THUMB = "imageWithThumb";
//Metadata[].widget[].action(type = movie).material.fileid
exports.WIDGET_MOVIE = "widget_movie";

//CaseView 案例视图
//metadata[].material.fileId
exports.IMG_CASE = "img_case";

//gallery 画廊
//metadata[].material.fileId
exports.GALLERY = "gallery";
// 载入封面

//solutionmap 解决方案
//metadata[].material.fileId
exports.SOLUTIONMAP = "solutionmap";
//metadata[].widget[].action.material.fileId
exports.WIDGET_IMAGE = "widget_image";

//Introduction 事例
//metadata[].material.fileId
exports.INTRODUCTION = "introduction";
//Metadata[].widget[].action..material(bg_material_id)
exports.WIDGET_BACKGROUND = "widget_background";

/**
 * Datastore 用常量 未来用
 */
exports.APP_NAME = "Yi";
exports.SCHEMA_REPORT = "report";
exports.BOARD_REPORT  = "list";