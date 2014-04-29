
function add(next){

    var productName = $("#productName").val();
    var productSN = $("#productSN").val();
    var productCategoryId = $("#category_list").val();
    var productUnitId = $("#unit_list").val();
    var productSupplierId = $("#supplier_list").val();
    var productRoomId = $("#room_list").val();
    var productCode = $("#productCode").val();
    var productPrice = $("#productPrice").val();
    var productDescription = $("#productDescription").val();

    var opt = {
      productName         : productName ,
      productSN           : productSN ,

      productCategoryId   : productCategoryId ,
      productSupplierId   : productSupplierId ,
      productRoomId       : productRoomId ,
      productUnitId       : productUnitId,

      productCode         : productCode,
      productPrice        : productPrice,
      productDescription  : productDescription
    };

    smart.dopost("/api/product/add.json",opt,function(err,result){
      next();
    });
}
function addAndBack (){
  var back = function(){
    var url = "ajax/product";
    var container = $('#content');
    loadURL(url, container);
  };
  add(back);
}

function addAndNext (){
  var next = function(){
    addview();
  };
  add(next);

}

function addview() {
  $("#productName").val("");
  $("#productSN").val("");
  $("#productCode").val("");
  $("#productPrice").val("");
  $("#productDescription").val("");

  //初始化产品分类
  $("#category_list").html("");
  $("#unit_list").html("");
  $("#room_list").html("");
  $("#supplier_list").html("");

  smart.doget("/api/supplier/list.json",function(err,result) {
    var list = result.items;
    var tmpl = $('#tmpl_option').html();
    var container = $("#supplier_list");
    _.each(list, function(row){

      container.append(_.template(tmpl, {
        value : row._id,
        name : row.supplierName
      }));
    });
  });

  smart.doget("/api/category/list.json",function(err,result) {
    var list = result.items;
    var tmpl = $('#tmpl_option').html();
    var container = $("#category_list");
    _.each(list, function(row){

      container.append(_.template(tmpl, {
        value : row._id,
        name : row.name
      }));
    });
  });

  smart.doget("/api/unit/list.json",function(err,result) {
    var list = result.items;
    var tmpl = $('#tmpl_option').html();
    var container = $("#unit_list");
    _.each(list, function(row){

      container.append(_.template(tmpl, {
        value : row._id,
        name : row.unitName
      }));
    });
  });

  smart.doget("/api/room/list.json",function(err,result) {
    var list = result.items;
    var tmpl = $('#tmpl_option').html();
    var container = $("#room_list");
    _.each(list, function(row){

      container.append(_.template(tmpl, {
        value : row._id,
        name : row.roomName
      }));
    });
  });



};