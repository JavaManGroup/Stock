



function categoryDeleteBtn(dataId){

  var data = {
    categoryId : dataId
  }

  smart.dopost("/api/category/delete.json",data ,function(err,result){

    render(0, count);

    $.smallBox({
      title : "提示",
      content : "删除成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
  });
}
function categoryUpdateBtn(dataId) {

  $('#categoryAddModal').modal('show');
  smart.doget("/api/category/get.json?categoryId=" + dataId ,function(err,result){

    $("#categoryId").val(result._id);
    $("#categoryName").val(result.name);
  });
}

function event(){
  $("#categoryAddBtn").click(function(){

    var categoryName = $("#categoryName").val();
    var categoryId = $("#categoryId").val();

    if (categoryName.length == 0) {

      $.smallBox({
        title : "提示",
        content : "请输入名称",
        color : "#a90329",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
      return;
    }

    var data = {
      categoryName : categoryName
    };

    if(categoryId) {
      data.categoryId = categoryId;
      smart.dopost("/api/category/update.json",data ,function(e,result){

        if (smart.error(e || result.systemError, result.systemError || "", true)) {
          return;
        }

        render(0, count);
        $("#categoryId").val('');
        $('#categoryAddModal').modal('hide');

        $.smallBox({
          title : "提示",
          content : "修改成功",
          color : "#739E73",
          iconSmall : "fa fa-bullhorn",
          timeout : 2000
        });

      });
      return;
    }

    $("#categoryName").val("");
    smart.dopost("/api/category/add.json", data, function (e, result) {

      if (smart.error(e || result.systemError, result.systemError || "", true)) {
        return;
      }

      smart.paginationInitalized = false;
      $("#pagination_area").html("");
      render(0, count);
      $('#categoryAddModal').modal('hide');

      $.smallBox({
        title : "提示",
        content : "添加成功",
        color : "#739E73",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
    });
  });

}

function render(start, count,keyword) {

  var jsonUrl = "/api/category/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }
  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e || result.systemError, result.systemError || "", true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_category_list').html();
    var container = $("#category_list");
    container.html("");

    console.log(list);

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index ++ ,
        categoryId : row._id,
        categoryName :row.name ,
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
};


