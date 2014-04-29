
function addView(){
  var url = "ajax/product/add";
  var container = $('#content');
  loadURL(url, container);
}
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
        index : index++ ,
        productSN :row.productSN ,
        productName: row.productName ,
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
    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render(active,count);
    });
  });

}
