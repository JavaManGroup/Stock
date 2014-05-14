
var tmpSupplierList = [];

function addView () {
  $("#addModal").modal("show");

  $("#txtDate").val((new Date()).pattern("yyyy-MM-dd") );
}

function addCostView(id) {
  $("#addCostModal").modal("show");
  $("#supplier_list").html("");
  smart.doget("/supplier/list?limit=" + Number.MAX_VALUE, function (err, result) {
    var list = result.items;
    tmpSupplierList = list;
    var tmpl = $('#tmpl_option').html();
    var container = $("#supplier_list");
    _.each(list, function(row){

      container.append(_.template(tmpl, {
        value : row._id,
        name : row.supplierName
      }));
    });
  });

  $("#addCostBtn").unbind("click").bind("click",function(){
    addCost(id)
  });
}

function addCost(id) {

  var supplierId = $("#supplier_list").val();
  var supplierCost = $("#supplierCost").val();

  var data = {
    historyId : id ,
    supplierId : supplierId ,
    supplierCost : supplierCost
  };
  for (var i in tmpSupplierList) {

    if (tmpSupplierList[i]._id == supplierId) {
      data.supplierName = tmpSupplierList[i].supplierName;
    }
  }
  smart.dopost("/api/plan/history/addCost.json", data, function (err, result) {

    $("#addCostModal").modal("hide");
    $.smallBox({
      title : "提示",
      content : "添加成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
    render(start, count);
  });
}

function detailPlanView(id) {

  var url = "/ajax/plan/detail?historyId=" + id;
  var container = $('#content');

  window.location.hash = url;

  loadURL(url, container);
}

function add() {
  var txt = $("#txtDate").val();

  var data = {
    date: txt
  }

  smart.dopost("/api/plan/history/add.json", data, function (err,result) {

    $("#addModal").modal("hide");

    if (result.data.systemError) {
      $.smallBox({
        title : "提示",
        content : result.data.systemError,
        color : "#a90329",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
      return;
    }
    $.smallBox({
      title : "提示",
      content : "添加成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
    render(start, count);
  });
}

function render(start_, count_) {


  var jsonUrl = "/api/plan/history/list.json?";
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
        index: index++,
        id : row._id,
        date: row.date,
        totalPlandetail: row.totalPlandetail || 0,
        planCost: row.planCost.length > 0 ? row.planCost : [],
        planMoneyAmount : renderPlanMoneyAmount(row.planCost) || 0,
        username: "",
        status: renderStatus(row.status),
        createat: smart.date(row.createat),
        updateat: smart.date(row.editat)
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


function renderPlanMoneyAmount(planCost){
  var amount = 0;

  for (var i in planCost) {
    amount = amount + planCost[i].supplierCost;
  }
  return amount
}

function renderStatus(status) {

  if(status == 1) {
    return "未提交"
  } else if(status == 2) {
    return "提交"
  } else if(status == 3) {
    return "取下"
  }
}