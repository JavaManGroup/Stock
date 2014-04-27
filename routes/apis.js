
var product = require("../apis/product")
  , category = require("../apis/category");


"use strict";

exports.guiding = function(app){

  // APIs
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


