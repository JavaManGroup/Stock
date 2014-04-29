


function adjustPopup(id) {
  $.SmartMessageBox({
    title : "调整盘点",
    content : "请输入调整后的数值",
    buttons : "[确认]",
    input : "text"
  }, function(ButtonPress, Value) {
    alert(ButtonPress + " " + Value);
  });
};

function event() {

}

function render(start, count,keyword) {

  var jsonUrl = "/api/take/detail.json?";
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
    var tmpl = $('#tmpl_takedetail_list').html();
    var container = $("#takedetail_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {

        index: index++,
        id: row._id,
        sn: row.productSN,
        name: row.productName,
        unit: row.productUnit,
        category: row.productCategory,
        original: row.original,
        amount: row.amount,
        adjustment: row.adjustment || 0,
        createat: smart.date(row.createat)

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
