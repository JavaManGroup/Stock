
var tmpCategoryList = [];

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

    smart.paginationInitalized = false;
    $("#popup_pagination_area").html("");

    smart.pagination($("#popup_pagination_area"), result.totalItems, count, function(active, rowCount) {
      pupopData(active,count);
    });
  });
};

function selectBtn(id) {

  smart.doget("/api/product/list.json?ids=" + id.split(), function (err, result) {

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_taking_list').html();
    var container = $("#taking_list");



    _.each(list, function(row) {

      container.append(_.template(tmpl, {
        index : index ++ ,
        id : "",
        productId : row._id ,
        sn : row.productSN ,
        name : row.productName ,
        unit : row.unit.unitName ,
        amount : row.amount || 0,
        expect : row.amount || 0,
        createat : smart.date(row.createat) ,
        userName :"浩",
        editat : smart.date(row.editat),
        createby : row.createby || "浩"
      }));
    });
    $("#selectModal").modal("hide");
  });
};

function appendTakeList() {

  $("#selectModal").modal("show");
  pupopData(start,count);
}

function addTake(tips){
  var takeList = $(".takeNum");
  var takeRow = $(".takeRow");

  var tmpAddTakeList = [];

  _.each(takeRow  , function(tk){

    var value = $($(tk).find(".takeData")).val();

    if (value && value.length > 0) {

      tmpAddTakeList.push({

        stockId : $($(tk).find(".takeData")).attr("data") ,
        stockTips : $($(tk).find(".takeTips")).val() ,
        takeValue : $($(tk).find(".takeData")).val() ,
        productId : $($(tk).find(".takeData")).attr("productId")
      });
    }
  });

  var type = $("#type").val();

  var data = {
    type : type ,
    takeList : tmpAddTakeList,
    tips : tips
  };

  smart.dopost("/api/stock/addTake.json", data, function (err, result) {

    render(0,10,"");
  });
}
function add() {
  $.SmartMessageBox({
    title: "备注",
    content: "请输入本期备注",
    buttons: "[提交]",
    input: "text",
    placeholder: "备注"

  }, function (ButtonPress, tips) {
    if(tips) {
      addTake(tips);
    } else {
      alert("请输入tips");
    }
  });
};

function event() {

};

function onCheckedTouched(that) {

  if ($(that).attr("checked")) {

    $(that).removeAttr("checked");
    tmpCategoryList = _.without(tmpCategoryList,$(that).val());
  } else {

    tmpCategoryList.push($(that).val());
    $(that).attr("checked", 'true');
  }
  render(start, count);
}

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


function render(start, count,keyword) {

  var type = $("#type").val();

  var jsonUrl = "/api/stock/getTakeList.json?";
  jsonUrl += "type=" + type;


  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }

  if (tmpCategoryList && tmpCategoryList.length) {
    jsonUrl += "&category=" + tmpCategoryList.join();
  }

  smart.doget(jsonUrl, function(e, result) {

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_taking_list').html();
    var container = $("#taking_list");
    container.html("");

    console.log(list);

    _.each(list, function(row) {

      container.append(_.template(tmpl, {
        index : index ++ ,
        id : row._id ,
        productId : row.product._id ,
        sn : row.product.productSN ,
        name : row.product.productName ,
        unit : row.product.unit.unitName ,
        category : row.product.category.name ,
        originalAmount : row.originalAmount || 0,
        expect : row.amount || 0,
        createat : smart.date(row.createat) ,
        userName :"浩",
        editat : smart.date(row.editat),
        createby : row.createby || "浩"
      }));
    });

    if(!list || list.length == 0 ) {
      container.html("没有记录");
    }

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, 10, function(active) {

      render(active,count);
    });
  });
}
