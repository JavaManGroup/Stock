
var product = require("../apis/product")
  , category = require("../apis/category")
  , unit = require("../apis/unit")
  , room = require("../apis/room")
  , supplier = require("../apis/supplier")
  , stock = require("../apis/stock");


"use strict";

exports.guiding = function(app){

  // APIs
  // stock

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

  app.get('/api/product/list.json', function(req, res) {
    product.productList(req, res);
  });

  app.post('/api/product/add.json', function(req, res) {
    product.productAdd(req, res);
  });

};


