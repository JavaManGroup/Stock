


function addView() {
  $('#addBtn').html("添加");
  $("#roomId").val("");
  $("#roomNum").val("");
  $("#roomName").val("");
}

function add() {

  var roomNum   = $("#roomNum").val();
  var roomName  = $("#roomName").val();

  var roomId = $("#roomId").val();

  if (roomNum.length == 0 || roomName.length == 0) {

    $.smallBox({
      title : "提示",
      content : "请检查输入的内容",
      color : "#a90329",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
    return;
  }

  var data = {
    roomNum   : roomNum   ,
    roomName  : roomName
  };
  var filter = {
    _id : roomId
  }
  if (roomId) {

    smart.doput("/room/update", {
      filter: filter,
      data: data
    }, function (e, result) {

      if (smart.error(e || result.systemError, result.systemError || "", true)) {
        return;
      }

      render(0, count);
      $("#roomId").val('');
      $('#roomAddModal').modal('hide');

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

  $("#roomName").val("");
  smart.dopost("/room/add", { data: data}, function (e, result) {

    if (smart.error(e || result.systemError, result.systemError || "", true)) {
      return;
    }

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#roomAddModal').modal('hide');

    $.smallBox({
      title : "提示",
      content : "修改成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });
  });
}


function deleteBtn(dataId){

  $.SmartMessageBox({
    title : "确认",
    content : "是否删除",
    buttons : "[取消],[确认]",
    input : "text"
  }, function(ButtonPress, value) {

    if (ButtonPress == "确认") {

      var filter = {
        _id : dataId
      }

      smart.dodelete("/room/remove", {
        filter: filter
      }, function (e, result) {

        if (smart.error(e || result.systemError, result.systemError || "", true)) {
          return;
        }

        smart.paginationInitalized = false;
        $("#pagination_area").html("");
        render(0, count);

        $.smallBox({
          title : "提示",
          content : "修改成功",
          color : "#739E73",
          iconSmall : "fa fa-bullhorn",
          timeout : 2000
        });
      });
    }
  });
}

function updateBtn(dataId) {

  $('#roomAddModal').modal('show');
  $('#addBtn').html("修改");
  smart.doget("/room/get?_id=" + dataId ,function(err,result){
    var obj = result.items[0];

    $("#roomId").val(obj._id);
    $("#roomNum").val(obj.roomNum);
    $("#roomName").val(obj.roomName);
  });
}

function event(){
}

function render(start, count,keyword) {

  var jsonUrl = "/room/list?";
  jsonUrl += "skip=" + start;
  jsonUrl += "&limit=" + count;

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
    var tmpl = $('#tmpl_room_list').html();
    var container = $("#room_list");
    container.html("");

    console.log(list);

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index: index++,
        roomId: row._id,
        roomNum: row.roomNum,
        roomName: row.roomName,
        createat: smart.date(row.createAt),
        userName: result.options.user[row.createBy].first,
        editat: smart.date(row.updateAt),
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


