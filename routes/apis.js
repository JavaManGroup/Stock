
var product = require("../apis/product")
  , category = require("../apis/category")
  , unit = require("../apis/unit")
  , room = require("../apis/room")
  , supplier = require("../apis/supplier")
  , stock = require("../apis/stock")
  , plan = require("../apis/plan");


"use strict";

exports.guiding = function(app){





  app.post("/api/plan/detail/remove.json", function(req, res) {

    plan.removePlanDetail(req,res);
  });
  app.post("/api/plan/detail/update.json", function(req, res) {

    plan.updatePlanDetail(req,res);
  });

  app.get('/api/plan/history/get.json', function (req, res) {
    plan.getPlanHistory(req, res);
  });


  app.post('/api/plan/history/cancel.json', function(req, res) {
    req.body.status = 3;
    plan.updatePlanHistory(req,res);
  });

  app.post('/api/plan/history/saveDetail.json', function(req, res) {
    req.body.status = 2;
    plan.updatePlanHistory(req,res);
  });

  app.post('/api/plan/history/addCost.json', function(req, res) {
    plan.updatePlanHistory(req,res);
  });

  app.post('/api/plan/detail/add.json', function(req, res) {
    plan.addPlanDetail(req,res);
  });

  app.get('/api/plan/detail/list.json', function(req, res) {
    plan.getPlanDetailList(req,res);
  });

  app.get('/api/plan/history/list.json', function(req, res) {
    plan.getPlanHistoryList(req,res);
  });


  app.post('/api/plan/history/add.json', function(req, res) {
    plan.addPlanHistory(req,res);
  });

  // APIs
  app.get('/api/plan/today/list.json', function(req, res) {
    plan.getPlanTodayList(req,res);
  });

  app.post('/api/plan/remove.json', function(req, res) {
    plan.removePlan(req,res);
  });

  app.get('/api/plan/getCatalogList.json', function(req, res) {
    plan.getPlanCatalogList(req,res);
  });

  app.post('/api/plan/addCatalog.json', function(req, res) {
    plan.addPlanCatalog(req,res);
  });


  app.post('/api/take/detail/add.json', function(req, res) {
    stock.addTakeDetail(req,res);
  });

  app.post('/api/take/update.json', function(req, res) {
    stock.updateTakeValue(req,res);
  });

  // stock
  app.get('/api/take/detail.json', function(req, res) {
    stock.getTakeDetailList(req,res);
  });

  app.get('/api/take/history.json', function(req, res) {
    stock.getTakeHistoryList(req,res);
  });



  app.post('/api/stock/setLower.json', function(req, res) {
    stock.updateStock(req, res);
  });

  app.post('/api/stock/remove.json', function(req, res) {
    stock.removeStock(req,res);
  });

  app.post('/api/stock/addTake.json', function(req, res) {
    stock.addTake(req,res);
  });

  app.get('/api/stock/getTakeList.json', function(req, res) {
    stock.getTakeList(req,res);
  });

  app.get('/api/stock/list.json', function(req, res) {
    stock.list(req,res);
  });

  app.post("/api/stock/add.json", function (req, res) {
    stock.addStock(req,res);
  });

  // supplier
  app.post('/api/supplier/update.json', function(req, res) {
    supplier.supplierUpdate(req, res);
  });

  app.post('/api/supplier/delete.json', function(req, res) {
    supplier.deleteSupplier(req, res);
  });

  app.get('/api/supplier/get.json', function(req, res) {
    supplier.getSupplier(req, res);
  });
  app.get('/api/supplier/list.json', function(req, res) {
    supplier.supplierList(req, res);
  });

  app.post('/api/supplier/add.json', function(req, res) {
    supplier.supplierAdd(req, res);
  });
  
  
  // room
  app.post('/api/room/update.json', function(req, res) {
    room.roomUpdate(req, res);
  });

  app.post('/api/room/delete.json', function(req, res) {
    room.deleteRoom(req, res);
  });

  app.get('/api/room/get.json', function(req, res) {
    room.getRoom(req, res);
  });
  app.get('/api/room/list.json', function(req, res) {
    room.roomList(req, res);
  });

  app.post('/api/room/add.json', function(req, res) {
    room.roomAdd(req, res);
  });

  // unit
  app.post('/api/unit/update.json', function(req, res) {
    unit.unitUpdate(req, res);
  });

  app.post('/api/unit/delete.json', function(req, res) {
    unit.deleteUnit(req, res);
  });

  app.get('/api/unit/get.json', function(req, res) {
    unit.getUnit(req, res);
  });
  app.get('/api/unit/list.json', function(req, res) {
    unit.unitList(req, res);
  });

  app.post('/api/unit/add.json', function(req, res) {
    unit.unitAdd(req, res);
  });

  //category
  app.post('/api/category/update.json', function(req, res) {
    category.categoryUpdate(req, res);
  });

  app.post('/api/category/delete.json', function(req, res) {
    category.deleteCategory(req, res);
  });

  app.get('/api/category/get.json', function(req, res) {
    category.getCategory(req, res);
  });

  app.get('/api/category/list.json', function(req, res) {
    category.categoryList(req, res);
  });

  app.post('/api/category/add.json', function(req, res) {
    category.categoryAdd(req, res);
  });



  app.post('/api/product/remove.json', function(req, res) {
    product.removeProduct(req, res);
  });

  app.post('/api/product/update.json', function(req, res) {
    product.updateProduct(req, res);
  });

  app.get('/api/product/get.json', function(req, res) {
    product.getProduct(req, res);
  });

  app.get('/api/product/list.json', function(req, res) {
    product.productList(req, res);
  });

  app.post('/api/product/add.json', function(req, res) {
    product.productAdd(req, res);
  });
};


