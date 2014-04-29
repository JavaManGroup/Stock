


function addView() {
  $('#addBtn').html("添加");
  $("#supplierId").val("");
  $("#supplierNum").val("");
  $("#supplierName").val("");
  $("#supplierPhone").val("");
}

function add() {

  var supplierNum   = $("#supplierNum").val();
  var supplierName  = $("#supplierName").val();
  var supplierPhone  = $("#supplierPhone").val();

  var supplierId = $("#supplierId").val();

  var data = {
    supplierNum   : supplierNum   ,
    supplierName  : supplierName  ,
    supplierPhone : supplierPhone
  };

  if (supplierId) {
    data.supplierId = supplierId;
    smart.dopost("/api/supplier/update.json",data ,function(err,result){

      render(0, count);
      $("#supplierId").val('');
      $('#supplierAddModal').modal('hide')
    });
    return;
  }

  $("#supplierName").val("");
  smart.dopost("/api/supplier/add.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#supplierAddModal').modal('hide')
  });
}


function deleteBtn(dataId){

  var data = {
    supplierId : dataId
  }

  smart.dopost("/api/supplier/delete.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
  });
}
function updateBtn(dataId) {

  $('#supplierAddModal').modal('show');
  $('#addBtn').html("修改");
  smart.doget("/api/supplier/get.json?supplierId=" + dataId ,function(err,result){

    $("#supplierId").val(result._id);
    $("#supplierNum").val(result.supplierNum);
    $("#supplierName").val(result.supplierName);
    $("#supplierScale").val(result.supplierPhone);
  });
}

function event() {

}

function render(start, count,keyword) {

  var jsonUrl = "/api/supplier/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }
  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_supplier_list').html();
    var container = $("#supplier_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index ++ ,
        supplierId    : row._id ,
        supplierNum   : row.supplierNum   ,
        supplierName  : row.supplierName  ,
        supplierPhone : row.supplierPhone  ,
        createat : smart.date(row.createat) ,
        userName :"浩",
        editat : smart.date(row.editat),
        createby : row.createby
      }));
    });

    if(!list || list.length == 0 ){
      container.html("没有记录");
    }

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, 10, function(active) {

      render(active,count);
    });
  });

}


