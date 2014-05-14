

function gotoDetail(id,type){

  var url = "ajax/take/detail?takeId=" + id +"&type=" + type;
  var container = $('#content');

  window.location.hash = url;

  loadURL(url, container);
};

function render(start, count,keyword) {

  var jsonUrl = "/api/take/history.json?";
  jsonUrl += "&start=" + start;
  jsonUrl += "&count=" + count;

  smart.doget(jsonUrl, function (err, result) {
    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_take_history_tr').html();
    var container = $("#take_history_body");
    container.html("");

    _.each(list, function (row) {

      container.append(_.template(tmpl, {

        index: index++,

        id : row._id,
        totalTakeProduct: row.totalTakeProduct,
        totalPrice: 12,
        today: row.today,
        createat: smart.date(row.createat),
        editat : smart.date(row.editat),
        tips: row.tips,
        type: type(row.type),
        status: row.status
      }));
    });

    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render(active,count);
    });
  });
}

function renderTips(tips) {
  var content = "";
  for(var i in tips) {
    content = content +  tips[i] + "\n"
  }
  return content
}

function type(t) {

  if (t == 1) {
    return "日盘";
  } else if (t == 2) {
    return "月盘";
  } else if (t == 3) {
    return "季盘";
  } else if (t == 4) {
    return "年盘";
  } else {
    return "";
  }
}

function event() {

}