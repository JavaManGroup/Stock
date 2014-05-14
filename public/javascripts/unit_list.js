

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

  if (unitNum.length == 0 || unitName.length == 0 || unitRadix.length == 0 || unitScale.length == 0) {

    $.smallBox({
      title : "提示",
      content : "请检查输入的内容",
      color : "#a90329",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
    return;
  }

  var filter = {
    _id : unitId
  }

  if (unitId) {

    return smart.doput("/unit/update",{
      filter: filter,
      data : data
    }, function (e, result) {

      if (smart.error(e || result.systemError, result.systemError || "", true)) {
        return;
      }

      render(0, count);
      $("#unitId").val('');
      $('#unitAddModal').modal('hide')

      $.smallBox({
        title: "提示",
        content: "修改成功",
        color: "#739E73",
        iconSmall: "fa fa-bullhorn",
        timeout: 2000
      });
    });
  }

  $("#unitName").val("");
  smart.dopost("/unit/add",{data:data} ,function(e,result){

    if (smart.error(e || result.systemError, result.systemError || "", true)) {
      return;
    }

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#unitAddModal').modal('hide');

    $.smallBox({
      title: "提示",
      content: "添加成功",
      color: "#739E73",
      iconSmall: "fa fa-bullhorn",
      timeout: 2000
    });
  });
}


function deleteBtn(dataId) {

  $.SmartMessageBox({
    title : "确认",
    content : "是否删除",
    buttons : "[取消],[确认]"
  }, function(ButtonPress, value) {

    if (ButtonPress == "确认") {

      var filter = {
        _id: dataId
      }

      smart.dodelete("/unit/remove", {
        filter: filter
      }, function (e, result) {

        if (smart.error(e || result.systemError, result.systemError || "", true)) {
          return;
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

  $('#unitAddModal').modal('show');

  $('#addBtn').html("修改");
  $("#unitId").val("");
  $("#unitNum").val("");
  $("#unitName").val("");
  $("#unitRadix").val("");
  $("#unitScale").val("");

  smart.doget("/unit/get?_id=" + dataId ,function(err,result){

    var obj = result.items[0];

    $("#unitId").val(obj._id);
    $("#unitNum").val(obj.unitNum);
    $("#unitName").val(obj.unitName);
    $("#unitRadix").val(obj.unitRadix);
    $("#unitScale").val(obj.unitScale);
  });
}

function event(){
}

function render(start, count,keyword) {

  var jsonUrl = "/unit/list?";
  jsonUrl += "skip=" + start;
  jsonUrl += "&limit=" + count;

  if (keyword) {

    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }

  smart.doget(jsonUrl, function (e, result) {

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

        index: index++,
        unitId: row._id,
        unitNum: row.unitNum,
        unitName: row.unitName,
        unitRadix: row.unitRadix,
        unitScale: row.unitScale,
        createat: smart.date(row.createat),
        userName: result.options.user[row.createBy].first,
        editat: smart.date(row.editat),
        createby: row.createby
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


