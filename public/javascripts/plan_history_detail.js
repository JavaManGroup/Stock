

function removePlanDetail(id) {

  var data = {
    plandetailId :id
  };

  $.SmartMessageBox({
    title: "提示",
    content: "确认删除",
    buttons: "[确认]"

  }, function (ButtonPress, value) {

    if(ButtonPress == '确认') {

      smart.dopost("/api/plan/detail/remove.json", data, function (e, result) {

        if (smart.error(e || result.systemError, result.systemError||"", true)) {
          return;
        }

        $.smallBox({
          title : "提示",
          content : "删除成功",
          color : "#739E73",
          iconSmall : "fa fa-bullhorn",
          timeout : 2000
        });

        smart.paginationInitalized = false;
        $("#pagination_area").html("");
        render(start, count);
      });
    }
  });

};

function editAmount(id) {

  var data = {
    plandetailId :id
  };

  $("#selectModal").modal("hide");

  $.SmartMessageBox({
    title: "数量",
    content: "请输入修改的数量",
    buttons: "[确认][取消]",
    input: "text",
    placeholder: "备注"

  }, function (ButtonPress, value) {

    if (_.isNaN(Number(value))) {

      alert("请输入数字");
      return;
    }
    if(ButtonPress == '确认') {

      data.planAmount = Number(value);

      smart.dopost("/api/plan/detail/update.json", data, function (e, result) {

        if (smart.error(e || result.systemError, result.systemError, true)) {
          return;
        }

        $.smallBox({
          title : "提示",
          content : "修改成功",
          color : "#739E73",
          iconSmall : "fa fa-bullhorn",
          timeout : 2000
        });

        smart.paginationInitalized = false;
        $("#pagination_area").html("");
        render(start, count);
      });
    }
  });
};

function cancelDetail() {
  var historyId = $("#historyId").val();

  var data = {
    historyId : historyId
  };

  smart.dopost("/api/plan/history/cancel.json", data, function (e, result) {

    if (smart.error(e || result.systemError, result.systemError, true)) {
      return;
    }

    $.smallBox({
      title : "提示",
      content : "提交成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });

    render(start, count);
  });
}

function saveDetail() {
  var historyId = $("#historyId").val();

  var data = {
    historyId : historyId
  };

  smart.dopost("/api/plan/history/saveDetail.json", data, function (e, result) {

    if (smart.error(e || result.systemError, result.systemError, true)) {
      return;
    }

    $.smallBox({
      title : "提示",
      content : "提交成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });

    render(start, count);
  });
}

var pupopData = function(start, count) {

  var jsonUrl = "/api/product/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, "系统错误", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_product_list').html();
    var container = $("#product_list");
    container.html("");

    _.each(list, function(row){

      console.log(row);

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
        stockLower : row.lower || "-",
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

  var historyId = $("#historyId").val();

  var data = {
    productId :id ,
    historyId : historyId
  };

  $("#selectModal").modal("hide");

  $.SmartMessageBox({
    title: "数量",
    content: "请输入数量",
    buttons: "[确认][取消]",
    input: "text",
    placeholder: "备注"

  }, function (ButtonPress, value) {

    if (_.isNaN(Number(value))) {

      alert("请输入数字");
      return;
    }
    if(ButtonPress == '确认') {

      data.planAmount = Number(value);

      smart.dopost("/api/plan/detail/add.json", data, function (err, result) {

        smart.paginationInitalized = false;
        $("#pagination_area").html("");
        render(start, count);
      });
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


  $("#listTitle").html("采购计划列表");

  var historyId = $("#historyId").val();

  var jsonUrl = "/api/plan/detail/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;
  jsonUrl += "&historyId=" + historyId;


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
        id :row._id ,
        productSN :row.productSN ,
        productName: row.productName ,
        productPrice :row.productPrice,
        category : row.productCategory,
        supplierPhone : row.supplierPhone || "" ,
        unit : row.productUnit,
        room : row.productRoom ,
        supplier : row.productSupplier ,
        planAmount : row.planAmount,
        stockAmount : 0,
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


    smart.doget("/api/plan/history/get.json?historyId=" + historyId, function (err, result) {

      $("#historyDate").html(result.date);
      $("#historyTotal").html(result.totalDetail);
      if (result.status == 3) {
        $("#cancelBtn").hide();
        $("#saveDetailBtn").show();
        $("#addDetailBtn").show();
      } else if (result.status == 2) {
        $("#cancelBtn").show();
        $("#saveDetailBtn").hide();
        $("#addDetailBtn").hide();
        _.each($(".action"),function(e){
          $(e).hide();
        });
      } else {
        $("#cancelBtn").hide();
        $("#saveDetailBtn").show();
        $("#addDetailBtn").show();
      }
    });
  });
}