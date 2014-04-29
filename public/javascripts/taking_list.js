
function addTake(tips){
  var takeList = $(".takeNum");
  var tmpAddTakeList = [];

  _.each(takeList, function(tk){
    tmpAddTakeList.push({
      stockId : $(tk).attr("data") ,
      takeValue : $(tk).val()
    });
  });
  console.log(tmpAddTakeList);
  var type = $("#type").val();

  var data = {
    type : type ,
    takeList : tmpAddTakeList,
    tips : tips
  };

  smart.dopost("/api/stock/addTake.json", data, function (err, result) {

    render(0,10,"");
  });
}
function add() {
  $.SmartMessageBox({
    title: "备注",
    content: "请输入本期备注",
    buttons: "[提交]",
    input: "text",
    placeholder: "备注"

  }, function (ButtonPress, tips) {
    if(tips) {
      addTake(tips);
    } else {
      alert("请输入tips");
    }
  });
};

function event() {

}

function render(start, count,keyword) {

  var type = $("#type").val();

  var jsonUrl = "/api/stock/getTakeList.json?";
  jsonUrl += "type=" + type;


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
    var tmpl = $('#tmpl_taking_list').html();
    var container = $("#taking_list");
    container.html("");

    console.log(list);

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index ++ ,
        id : row._id ,
        sn : row.product.productSN ,
        name : row.product.productName ,
        unit : row.product.unit.unitName ,
        amount : row.amount || 0,
        expect : row.amount || 0,
        createat : smart.date(row.createat) ,
        userName :"浩",
        editat : smart.date(row.editat),
        createby : row.createby || "浩"
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
