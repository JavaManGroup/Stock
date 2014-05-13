


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

  if (supplierName.length == 0 || supplierNum.length == 0 || supplierPhone.length == 0) {

    $.smallBox({
      title : "提示",
      content : "请检查输入的内容",
      color : "#a90329",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });

    return;
  }


  var data = {
    supplierNum   : supplierNum   ,
    supplierName  : supplierName  ,
    supplierPhone : supplierPhone
  };

  var filter = {
    _id : supplierId
  };

  if (supplierId) {

    return smart.doput("/supplier/update",{
      filter: filter,
      data : data
    }, function (e, result) {

      if (smart.error(e || result.systemError, result.systemError || "", true)) {
        return;
      }

      render(0, count);
      $("#supplierId").val('');
      $('#supplierAddModal').modal('hide');

      $.smallBox({
        title : "提示",
        content : "修改成功",
        color : "#739E73",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
    });
  }

  $("#supplierName").val("");
  smart.dopost("/supplier/add", {data: data}, function (err, result) {

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#supplierAddModal').modal('hide')

    $.smallBox({
      title : "提示",
      content : "添加成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
  });
}


function deleteBtn(dataId){


  $.SmartMessageBox({
    title : "确认",
    content : "是否删除",
    buttons : "[取消],[确认]"
  }, function(ButtonPress, value) {

    if (ButtonPress == "确认") {


      var filter = {
        _id : dataId
      }

      smart.dodelete("/supplier/remove",{
        filter: filter
      } ,function(err,result){

        if (err) {

          $.smallBox({
            title : "提示",
            content : "系统错误",
            color : "#a90329",
            iconSmall : "fa fa-bullhorn",
            timeout : 2000
          });
          return ;
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
        render(0, count);

      });
    }
  });

}
function updateBtn(dataId) {

  $('#supplierAddModal').modal('show');
  $('#addBtn').html("修改");

  $("#supplierId").val("");
  $("#supplierNum").val("");
  $("#supplierName").val("");
  $("#supplierPhone").val("");

  smart.doget("/supplier/get?_id=" + dataId ,function(err,result){
    var obj = result.items[0];

    $("#supplierId").val(obj._id);
    $("#supplierNum").val(obj.supplierNum);
    $("#supplierName").val(obj.supplierName);
    $("#supplierPhone").val(obj.supplierPhone);
  });
}

function event() {

}

function render(start, count,keyword) {

  var jsonUrl = "/supplier/list?";
  jsonUrl += "skip=" + start;
  jsonUrl += "&limit=" + count;

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
        createat : smart.date(row.createAt) ,
        userName :"浩",
        editat : smart.date(row.updateAt),
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


