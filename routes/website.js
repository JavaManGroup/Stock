"use strict";

var util    = require("../core/utils")
  , user      = require("../apis/user")
  , context = smart.framework.context
  , log   = smart.framework.log;

var product = require("../controllers/ctrl_product");

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

  //plan
  app.get("/ajax/plan/detail", function (req, res) {
    var handler = new context().bind(req, res);
    var historyId = req.query.historyId;
    res.render("plan_detail", {"title": __(handler, "采购详细"), "historyId": historyId});
  });

  app.get("/ajax/plan/history", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("plan_history", {"title": __(handler, "采购历史")});
  });

  app.get("/ajax/plan/today", function (req, res) {
    var handler = new context().bind(req, res);
    res.render("plan_today", {"title": __(handler, "今日采购")});
  });

  app.get("/ajax/plan/list", function (req, res) {
    var handler = new context().bind(req, res);

    res.render("plan_list", {"title": __(handler, "采购目录")});
  });

  //take
  app.get("/ajax/take/detail", function (req, res) {
    var handler = new context().bind(req, res);
    var type = req.query.type;
    var takeId = req.query.takeId;
    res.render("take_detail", {"title": __(handler, "盘点记录详细") , "type":type , takeId: takeId});
  });

  app.get("/ajax/take/history", function (req, res) {
    var handler = new context().bind(req, res);
    var type = req.query.type;
    res.render("take_history", {"title": __(handler, "盘点记录") , "type":type});
  });

  app.get("/ajax/taking", function (req, res) {
    var handler = new context().bind(req, res);
    var type = req.query.type;
    handler.addParams("start",0);
    handler.addParams("count",Number.MAX_VALUE);
    product.list(handler,function(err,result) {
      res.render("take_list", {"title": __(handler, "盘点") , "type":type , "productList" : result.items});
    })
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
    var id = req.query.id || "";
    res.render("product_add", {"title": __(handler, "产品列表"), productId: id });
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
};

