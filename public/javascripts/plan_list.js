
var tmpProductList = [];

function addView() {
  $('#addModal').modal('show');

  smart.doget("/api/category/list.json", function (err, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_category_tr').html();
    var container = $("#category_body");
    container.html("");

    _.each(list, function (row) {

      container.append(_.template(tmpl, {
        id: row._id,
        name: row.name,
        amount: row.amount || 1
      }));
    });
  });
};

function clickCategory(id) {

  smart.doget("/api/product/list.json?categoryId=" + id, function (err, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_product_tr').html();
    var container = $("#product_body");
    container.html("");

    _.each(list, function (row) {

      container.append(_.template(tmpl, {
        roomName: row.room.roomName,
        name: row.productName,
        sn: row.productSN,
        id: row._id
      }));
    });
  });
};



function event() {

}


function removePlan(id) {
  var data = {
    planId: id
  };
  smart.dopost("/api/plan/remove.json",data , function(err, result){

    $("#addModal").modal("hide");
    render(start, count);
  });
}

function render(start, count, keyword) {

  var jsonUrl = "/api/plan/getCatalogList.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "count=" + count;

  smart.doget(jsonUrl, function (e, result) {

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_list').html();
    var container = $("#list");
    container.html("");

    console.log(list);

    _.each(list, function (row) {

      container.append(_.template(tmpl, {
        index: index++,
        id: row._id,
        productSN: row.product.productSN,
        productName: row.product.productName,
        productCategory : row.product.category.name,
        productRoom : row.product.room.roomName,
        productUnit : row.product.unit.unitName,
        productPrice : row.product.productPrice,
        unit: row.product.unit.unitName,
        amount: row.amount || 0,
        expect: row.amount || 0,
        createat: smart.date(row.createat),
        userName: "浩",
        editat: smart.date(row.editat),
        createby: row.createby || "浩"
      }));
    });

    if (!list || list.length == 0) {
      container.html("没有记录");
    }

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, 10, function (active) {

      render(active, count);
    });
  });
}

function checkProduct(that) {

  if (!$(that).attr("checked")) {

    tmpProductList.push(($(that).val()));
    $(that).attr("checked", true)
    tmpProductList = _.uniq(tmpProductList);
  } else {

    tmpProductList = _.without(tmpProductList, $(that).val());
    $(that).attr("checked", false)
  }
  renderTmpProductList();
}


function renderTmpProductList() {

  smart.doget("/api/product/list.json?ids=" + tmpProductList, function (err, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_has_product_tr').html();
    var container = $("#has_product_body");
    container.html("");

    _.each(list, function (row) {

      console.log(row);
      container.append(_.template(tmpl, {
        index : index++,
        roomName: row.room.roomName,
        categoryName: row.category.name,
        name: row.productName,
        sn: row.productSN,
        id: row._id
      }));
    });
  });
}


function add() {

  var data = {
    productIds: tmpProductList
  };
  smart.dopost("/api/plan/addCatalog.json",data , function(err, result){

    $("#addModal").modal("hide");
    render(start, count);
  });
}
