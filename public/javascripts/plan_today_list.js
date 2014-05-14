

var pupopData = function(start, count) {

  var jsonUrl = "/api/product/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_product_list').html();
    var container = $("#product_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index++ ,
        id :row._id ,
        productSN :row.productSN ,
        productName: row.productName ,
        productPrice : row.productPrice ,
        category : row.category.name ,
        unit : row.unit.unitName ,
        room : row.room.roomName ,
        supplier : row.supplier.supplierName ,
        createat : smart.date(row.createat) ,
        editat :  smart.date(row.editat),
        createby : row.user.first ,
        originalAmount : row.originalAmount
      }));
    });

    if(!list || list.length == 0 ){
      container.html("没有记录");
    }

    // 设定翻页


    smart.pagination($("#popup_pagination_area"), result.totalItems, count, function(active, rowCount) {
      pupopData(active,count);
    });
  });
};


function selectBtn(id) {

  var takeId = $("#takeId").val();

  var data = {
    productId :id ,
    takeId : takeId
  };

  $("#selectModal").modal("hide");

  $.SmartMessageBox({
    title: "数量",
    content: "请输入数量",
    buttons: "[确认][取消]",
    input: "text",
    placeholder: "备注"

  }, function (ButtonPress, value) {

    console.log(parseInt(value));

    if (_.isNaN(Number(value))) {

      alert("请输入数字");
      return;
    }
    if(ButtonPress == '确认') {

      data.takeValue = Number(value);

      alert(data.takeValue);
//      smart.dopost("/api/take/detail/add.json", data, function (err, result) {
//
//        smart.paginationInitalized = false;
//        $("#pagination_area").html("");
//        render(start, count);
//      });
    }
  });
};

function addView() {
  $("#selectModal").modal("show");

  smart.paginationInitalized = false;
  $("#popup_pagination_area").html("");
  pupopData(start,count);
}

function render(start , count ,keyword) {

  var jsonUrl = "/api/plan/today/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  smart.doget(jsonUrl, function (e, result) {

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_list').html();
    var container = $("#list");
    container.html("");

    _.each(list, function (row) {

      container.append(_.template(tmpl, {
        index : index++ ,
        productSN :row.product.productSN ,
        productName: row.product.productName ,
        category : row.product.category.name ,
        unit : row.product.unit.unitName ,
        room : row.product.room.roomName ,
        supplier : row.product.supplier.supplierName ,
        createat : smart.date(row.createat) ,
        editat :  smart.date(row.editat),
        createby : ""
      }));
    });

    if (!list || list.length == 0) {
      container.html("没有记录");
    }

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, count, function (active, rowCount) {
      render(active, count);
    });
  });
}