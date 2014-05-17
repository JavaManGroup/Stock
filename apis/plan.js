var response = smart.framework.response
  , errors = smart.framework.errors
  , util = smart.framework.util
  , context = smart.framework.context
  , log = smart.framework.log
  , _ = smart.util.underscore
  , plan = require('../controllers/ctrl_plan');


exports.removePlanDetail = function (req, res) {

  var handler = new context().bind(req, res);
  plan.removePlanDetail(handler, function (err, result) {

    response.send(res, err, result);
  });
};

exports.updatePlanDetail = function (req, res) {

  var handler = new context().bind(req, res);

  plan.updatePlanDetail(handler, function (err, result) {

    response.send(res, err, result);
  });
};


exports.getPlanHistory = function (req, res) {

  var handler = new context().bind(req, res);
  plan.getPlanHistory(handler, function (err, result) {

    response.send(res, err, result);
  });
};

exports.updatePlanHistory = function (req, res) {

  var handler = new context().bind(req, res);
  plan.updatePlanHistory(handler, function (err, result) {

    response.send(res, err, result);
  });
};

exports.getPlanDetailList = function (req, res) {

  var handler = new context().bind(req, res);
  plan.getPlanDetailList(handler, function (err, result) {

    response.send(res, err, result);
  });
};


exports.addPlanDetail = function (req, res) {
  var handler = new context().bind(req, res);
  plan.addPlanDetail(handler, function (err, result) {

    response.send(res, err, result);
  });
};

exports.getPlanHistoryList = function (req, res) {

  var handler = new context().bind(req, res);
  plan.getPlanHistoryList(handler, function (err, result) {

    response.send(res, err, result);
  });
}

exports.addPlanHistory = function (req, res) {

  var handler = new context().bind(req, res);
  plan.addPlanHistory(handler, function (err, result) {

    response.send(res, err, result);
  });
};

/**
 * 获得今日盘点的列表。
 * @param req
 * @param res
 */
exports.getPlanTodayList = function (req, res) {

  var handler = new context().bind(req, res);
  plan.getPlanTodayList(handler, function (err, result) {

    response.send(res, err, result);
  });
};

exports.removePlan = function (req, res) {

  var handler = new context().bind(req, res);

  plan.removePlan(handler, function (err, result) {
    response.send(res, err, result);
  });
};

exports.getPlanCatalogList = function (req, res) {

  var handler = new context().bind(req, res);

  plan.getPlanCatalogList(handler, function (err, result) {
    response.send(res, err, result);
  });
};


exports.addPlanCatalog = function (req, res) {

  var handler = new context().bind(req, res);

  plan.addPlanCatalog(handler, function (err, result) {
    response.send(res, err, result);
  });
};
