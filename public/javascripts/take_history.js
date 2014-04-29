

function gotoDetail(id,type){

  var url = "ajax/take/detail?takeId=" + id +"&type=" + type;
  var container = $('#content');
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
    console.log(result);

    _.each(list, function (row) {
      console.log(row);

      container.append(_.template(tmpl, {

        index: index++,

        id : row._id,
        total: 12,
        totalPrice: 12,
        today: row.today,
        createat: smart.date(row.createat),
        editat : smart.date(row.editat),
        userName: "123",
        tips: row.tips,
        type: row.type,
        status: row.status
      }));
    });

    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render(active,count);
    });
  });
}

function event() {

}