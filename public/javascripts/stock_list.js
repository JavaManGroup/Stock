var tmpProductList = [];
var tmpStockType = 1;

var tmpValue = 0;
function cleanInput(dom) {

  tmpValue = dom.value;
  if (dom.value == '-') {
    dom.value = "";
  }
}

function onBlurStockLower(dom, id) {

  var stockLower = dom.value;
  var stockId    = id;

  if (_.isNaN(Number(stockLower))) {

    dom.value = tmpValue;
    return;
  }

  var data = {
    stockId: stockId,
    stockLower: stockLower
  };

  smart.dopost("/api/stock/setLower.json", data, function (e, result) {

    if (smart.error(e || result.systemError, result.systemError || "", true)) {
      return;
    }

    $.smallBox({
      title : "提示",
      content : "修改成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });

    tmpValue = 0;
  });
}


function render(start, count,keyword) {

  var jsonUrl = "/api/stock/list.json?type=" + tmpStockType;
  jsonUrl += "&start=" + start;
  jsonUrl += "&count=" + count;

  smart.doget(jsonUrl, function (err, result) {
    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_stock_tr').html();
    var container = $("#stock_body");
    container.html("");
    console.log(result);

    _.each(list, function (row) {
      console.log(row.product.productName);

      container.append(_.template(tmpl, {
        index: index++,
        lower : row.lower || '-',
        sn: row.product.productSN,
        name: row.product.productName,
        category: row.product.category.name,
        room: row.product.room.roomName,
        originalAmount: row.originalAmount || 0,
        unit: row.product.unit.unitName,
        price: row.product.productPrice,
        stockType: row.type || 0,
        userName: row.user || 0,
        id: row._id,
        amount: row.amount || 1
      }));
    });

    if(!list || list.length == 0 ){
      container.html("没有记录");
    }

    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render(active,count);
    });
  });
};

function addView() {
  $('#addModal').modal('show');

  $("#product_body").html("");
  $("#has_product_body").html("");

  tmpProductList = [];

  smart.doget("/api/category/list.json?count=99999", function (err, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_category_tr').html();
    var container = $("#category_body");
    container.html("");

    _.each(list, function (row) {

      container.append(_.template(tmpl, {
        id: row._id,
        name: row.name,
        amount: row.productTotal || 0
      }));
    });
  });
};

function add() {

  if (tmpProductList.length == 0) {
    alert("未选择产品");
    return;
  }

  var data = {
    stockIds: tmpProductList,
    type:tmpStockType
  };
  smart.dopost("/api/stock/add.json",data , function(err, result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(start, count);

    $("#addModal").modal("hide");
  });
}

function removeStock(id){

  var data = {
    stockId: id
  };
  smart.dopost("/api/stock/remove.json",data , function(err, result){

    $("#addModal").modal("hide");
    render(start, count);
  });
}

function removeProduct(id) {

  tmpProductList = _.without(tmpProductList, id);
  renderTmpProductList();
}

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

function event(){

  $("#btnGroupStockType").on("click","a",function(e){

    var type = $(e.target).attr("value");
    tmpStockType = type;
    render(start, count);
  });
}