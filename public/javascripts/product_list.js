

function render(start, count,keyword) {

  var jsonUrl = "/api/product/list.json?";
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
    var tmpl = $('#tmpl_product_list').html();
    var container = $("#product_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        productSN :row.productSN ,
        productName: row.productName ,
        createat : row.createat ,
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
