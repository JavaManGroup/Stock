


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

  var data = {
    roomNum   : roomNum   ,
    roomName  : roomName
  };

  if (roomId) {
    data.roomId = roomId;
    smart.dopost("/api/room/update.json",data ,function(err,result){

      render(0, count);
      $("#roomId").val('');
      $('#roomAddModal').modal('hide')
    });
    return;
  }

  $("#roomName").val("");
  smart.dopost("/api/room/add.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
    $('#roomAddModal').modal('hide')
  });
}


function deleteBtn(dataId){

  var data = {
    roomId : dataId
  }

  smart.dopost("/api/room/delete.json",data ,function(err,result){

    smart.paginationInitalized = false;
    $("#pagination_area").html("");
    render(0, count);
  });
}
function updateBtn(dataId) {

  $('#roomAddModal').modal('show');
  $('#addBtn').html("修改");
  smart.doget("/api/room/get.json?roomId=" + dataId ,function(err,result){

    $("#roomId").val(result._id);
    $("#roomNum").val(result.roomNum);
    $("#roomName").val(result.roomName);
    $("#roomRadix").val(result.roomRadix);
    $("#roomScale").val(result.roomScale);
  });
}

function event(){
  $("#categoryAddBtn").click(function(){

    var categoryName = $("#categoryName").val();
    var categoryId = $("#categoryId").val();
    var data = {
      categoryName : categoryName
    };

    if(categoryId) {
      data.categoryId = categoryId;
      smart.dopost("/api/category/update.json",data ,function(err,result){

        render(0, count);
        $("#categoryId").val('');
        $('#categoryAddModal').modal('hide')
      });
      return;
    }

    $("#categoryName").val("");
    smart.dopost("/api/category/add.json",data ,function(err,result){

      var url = "ajax/category";
      var container = $('#content');

      smart.paginationInitalized = false;
      $("#pagination_area").html("");
      render(0, count);
      $('#categoryAddModal').modal('hide')
    });
  });

  $(".categoryUpdateBtn a").click(function(e){

  });
}

function render(start, count,keyword) {

  var jsonUrl = "/api/room/list.json?";
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
    var tmpl = $('#tmpl_room_list').html();
    var container = $("#room_list");
    container.html("");

    console.log(list);

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        index : index ++ ,
        roomId    : row._id ,
        roomNum   : row.roomNum   ,
        roomName  : row.roomName  ,
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

}


