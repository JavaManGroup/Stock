
function event(){
  $("#categoryAddBtn").click(function(){

    var categoryName = $("#categoryName").val();

    var data = {
      categoryName : categoryName
    };

    smart.dopost("/api/category/add.json",data ,function(err,result){

      var url = "ajax/category";
      var container = $('#content');

      render(0, 20);
      $('#categoryAddModal').modal('hide')
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

    if (smart.error(e, "", true)) {
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
        createat : row.createat ,
        userName :"浩",
        editat : row.editat ,
        createby : row.createby
      }));
    });

    if(!list || list.length == 0 ){
      container.html("没有记录");
    }

    // 设定翻页
//    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
//      render.apply(window, [active, count]);
//    });
  });

}


