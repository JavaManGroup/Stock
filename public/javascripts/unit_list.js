

function addView() {
  $('#addBtn').html("添加");
  $("#unitNum").val("");
  $("#unitName").val("");
  $("#unitRadix").val("");
  $("#unitScale").val("");
}

function add() {

  var unitNum   = $("#unitNum").val();
  var unitName  = $("#unitName").val();
  var unitRadix = $("#unitRadix").val();
  var unitScale = $("#unitScale").val();

  var unitId = $("#unitId").val();

  var data = {
    unitNum   : unitNum   ,
    unitName  : unitName  ,
    unitRadix : unitRadix ,
    unitScale : unitScale
  };

  if (unitId) {
    data.unitId = unitId;
    smart.dopost("/api/unit/update.json",data ,function(err,result){

      render(0, count);
      $("#unitId").val('');
      $('#unitAddModal').modal('hide')
    });
    return;
  }

  $("#unitName").val("");
  smart.dopost("/api/unit/add.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#unitAddModal').modal('hide')
  });
}


function deleteBtn(dataId){

  var data = {
    unitId : dataId
  }

  smart.dopost("/api/unit/delete.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
  });
}
function updateBtn(dataId) {

  $('#unitAddModal').modal('show');
  $('#addBtn').html("修改");
  smart.doget("/api/unit/get.json?unitId=" + dataId ,function(err,result){

    $("#unitId").val(result._id);
    $("#unitNum").val(result.unitNum);
    $("#unitName").val(result.unitName);
    $("#unitRadix").val(result.unitRadix);
    $("#unitScale").val(result.unitScale);
  });
}

function event(){
  $("#categoryAddBtn").click(function(){

    var categoryName = $("#categoryName").val();
    var categoryId = $("#categoryId").val();
    var data = {
      categoryName : categoryName
    };

    if(categoryId) {
      data.categoryId = categoryId;
      smart.dopost("/api/category/update.json",data ,function(err,result){

        render(0, count);
        $("#categoryId").val('');
        $('#categoryAddModal').modal('hide')
      });
      return;
    }

    $("#categoryName").val("");
    smart.dopost("/api/category/add.json",data ,function(err,result){

      var url = "ajax/category";
      var container = $('#content');

      smart.paginationInitalized = false;
      $("#pagination_area").html("");
      render(0, count);
      $('#categoryAddModal').modal('hide')
    });
  });

  $(".categoryUpdateBtn a").click(function(e){

  });
}

function render(start, count,keyword) {

  var jsonUrl = "/api/unit/list.json?";
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
    var tmpl = $('#tmpl_unit_list').html();
    var container = $("#unit_list");
    container.html("");

    console.log(list);

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index ++ ,
        unitId    : row._id ,
        unitNum   : row.unitNum   ,
        unitName  : row.unitName  ,
        unitRadix : row.unitRadix ,
        unitScale : row.unitScale ,
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


