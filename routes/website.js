"use strict";

var util    = require("../core/utils")
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

