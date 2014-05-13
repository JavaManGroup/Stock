/**
 * @file 工具类，权限判断用等共同方法
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _         = smart.util.underscore
  , check    = smart.util.validator.check
  , error    = smart.framework.errors
  , middleware  = smart.framework.middleware
  , util        = smart.framework.util


exports.authenticate = function(req, res, next) {

  console.log("$$$$$$$$$$$$$$$$$$");
  console.log(req.url.indexOf("ajax"));

  try {
    middleware.authenticate(req, res, next);
  } catch (e) {

    if (e.code == 401 && util.isBrowser(req) && req.url.indexOf("ajax")) {

      return res.send("401");
    }

    if (e.code == 401 && util.isBrowser(req)) { // UnauthorizedError

      return res.redirect("/");  //
    }

    if (e.code == 401) {

      return res.send(401, {});  //
    }
  }
}


