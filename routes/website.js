"use strict";

var util    = require("../core/utils")
  , user      = require("../apis/user")
  , context = smart.framework.context
  , log   = smart.framework.log;

exports.guiding = function (app) {

  app.get("/", function (req, res) {
    var handler = new context().bind(req, res);
    log.operation("begin : show login");
    res.render("login", {"title": __(handler, "js.routes.website.top_signin.title")});
    log.operation("end : show login");
  });

  // Login画面
  app.get("/login", function (req, res) {
    var handler = new context().bind(req, res);
    log.operation("begin : show login");
    res.render("login", {"title": __(handler, "js.routes.website.top_signin.title")});
    log.operation("end : show login");
  });

  // 登陆
  app.get('/simplelogin', function (req, res) {
    user.simpleLogin(req, res);
  });

  app.get("/ajax/stock", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("stock_list", {"title": __(handler, "盘点目录")});
  });

  app.get("/ajax/supplier", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("supplier_list", {"title": __(handler, "供应商管理")});
  });

  app.get("/ajax/stockroom", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("stockroom_list", {"title": __(handler, "库房管理")});
  });

  app.get("/ajax/unit", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("unit_list", {"title": __(handler, "单位管理")});
  });

  app.get("/ajax/category", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("category_list", {"title": __(handler, "分类目录")});
  });

  app.get("/ajax/product", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("product_list", {"title": __(handler, "产品列表")});
  });

  app.get("/ajax/product/add", function (req, res) {
    var handler = new context().bind(req, res);
    console.log("dddddddddddddddddddddddddddd");
    res.render("product_add", {"title": __(handler, "产品列表")});
  });


  //error
  app.get("/error/400", function (req, res) {
    res.render("error_400",{user: req.session.user});
  });

  app.get("/error/403", function (req, res) {
    res.render("error_403",{user: req.session.user});
  });

  app.get("/error/500", function (req, res) {
    res.render("error_500",{user: req.session.user});
  });

  // ----------------------------------
  app.get("*", function (req, res) {
    res.send("404");
  });
};

