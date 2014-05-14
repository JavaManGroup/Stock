

var tmpCategoryList = [];
var tmpFilter = 0;

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
        createby : row.user.first
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

      smart.dopost("/api/take/detail/add.json", data, function (err, result) {

        smart.paginationInitalized = false;
        $("#pagination_area").html("");
        render(start, count);
      });
    }
  });
};

function addView(){

  $("#selectModal").modal("show");

  smart.paginationInitalized = false;
  $("#popup_pagination_area").html("");

  pupopData(start,count);
}
function addTips(id) {
  $.SmartMessageBox({
    title : "备注",
    content : "请输入备注",
    buttons : "[取消],[确认]",
    input : "text"
  }, function(ButtonPress, value) {

    if (ButtonPress == "确认") {
      var data = {
        takeId : id ,
        tipsValue :value
      }

      smart.dopost("/api/take/update.json",data,function(){

        render(start, count);
      });
    }
  });

}
function adjustPopup(id) {

  $.SmartMessageBox({
    title : "调整盘点",
    content : "请输入调整后的数值",
    buttons : "[取消],[确认]",
    input : "text"
  }, function(ButtonPress, value) {
    if (ButtonPress == "确认") {

      var data = {
        takeId : id ,
        value : value
      }

      smart.dopost("/api/take/update.json",data,function(){

        render(start, count);
      });
    }
  });
};

function event() {
};

function renderCategory() {

  var jsonUrl = "/api/category/list.json?";
  jsonUrl += "count=" + Number.MAX_VALUE;
  smart.doget(jsonUrl, function (e, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_category_list').html();
    var container = $("#category_list");
    container.html("");


    _.each(list, function(row){

      console.log(row);

      container.append(_.template(tmpl, {

        index: index++,
        id: row._id,
        value: row.name
      }));
    });
  });
};

function onCheckedTouched (that) {

  if ($(that).attr("checked")) {

    $(that).removeAttr("checked");
    tmpCategoryList = _.without(tmpCategoryList,$(that).val());
  } else {

    tmpCategoryList.push($(that).val());
    $(that).attr("checked", 'true');
  }

  smart.paginationInitalized = false;
  $("#pagination_area").html("");
  render(start, count);
}

function render(start_, count_,keyword) {

  var takeId = $("#takeId").val();

  var jsonUrl = "/api/take/detail.json?takeId=" + takeId;
  jsonUrl += "&start=" + start_;
  jsonUrl += "&count=" + count_;

  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }

  if (tmpCategoryList && tmpCategoryList.length) {
    jsonUrl += "&category=" + tmpCategoryList.join();
  }

  if (tmpFilter && tmpFilter > 0) {
    jsonUrl += "&filter=" + tmpFilter;
  }

  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_takedetail_list').html();
    var container = $("#takedetail_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {

        index: index++,
        id: row._id,
        sn: row.productSN,
        name: row.productName,
        unit: row.productUnit,
        category: row.productCategory,
        original: row.original,
        amount: row.amount,
        adjustment: row.adjustment || 0,
        tips : row.stockTips || "",
        createat: smart.date(row.createat)
      }));
    });

    if(!list || list.length == 0 ){
      container.html("没有记录");
    }

    // 设定翻页

    smart.pagination($("#pagination_area"), result.totalItems, 10, function(active) {
      start = active;

      render(active,count);
    });
  });

}

function onFilter(filter) {

  tmpFilter = filter
  render(start,count);
}