function add(next) {

  var productName = $("#productName").val();
  var productSN = $("#productSN").val();
  var productCategoryId = $("#category_list").val();
  var productUnitId = $("#unit_list").val();
  var productSupplierId = $("#supplier_list").val();
  var productRoomId = $("#room_list").val();
  var productCode = $("#productCode").val();
  var productPrice = $("#productPrice").val();
  var productDescription = $("#productDescription").val();


  if (productName.length == 0 || productSN.length == 0 || productCode.length == 0 || productPrice.length == 0 || productDescription.length == 0) {

    $.smallBox({
      title: "提示",
      content: "请检查输入的内容",
      color: "#a90329",
      iconSmall: "fa fa-bullhorn",
      timeout: 2000
    });
    return;
  }

  var opt = {
    productName: productName,
    productSN: productSN,

    productCategoryId: productCategoryId,
    productSupplierId: productSupplierId,
    productRoomId: productRoomId,
    productUnitId: productUnitId,

    productCode: productCode,
    productPrice: productPrice,
    productDescription: productDescription
  };

  var productId = $("#productId").val();

  if (productId) {

    opt.productId = productId;

    smart.dopost("/api/product/update.json", opt, function (e, result) {

      if (smart.error(e || result.systemError, result.systemError || "", true)) {
        return;
      }

      $.smallBox({
        title : "提示",
        content : "修改成功",
        color : "#739E73",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
      next();
    });
    return;
  }
  smart.dopost("/api/product/add.json", opt, function (e, result) {

    if (smart.error(e || result.systemError, result.systemError || "", true)) {
      return;
    }

    $.smallBox({
      title : "提示",
      content : "添加成功",
      color : "#739E73",
      iconSmall : "fa fa-bullhorn",
      timeout : 2000
    });

    next();
  });
};

function addAndBack (){
  var back = function(){
    var url = "ajax/product";
    var container = $('#content');

    window.location.hash = url;

    loadURL(url, container);
  };
  add(back);
}

function addAndNext (){

  var next = function(){
    addview();
  };

  add(next);
};

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



  async.parallel([
    function(cb){
      smart.doget("/supplier/list?limit=" + Number.MAX_VALUE, function (err, result) {

        var list = result.items;
        var tmpl = $('#tmpl_option').html();
        var container = $("#supplier_list");
        _.each(list, function(row){

          container.append(_.template(tmpl, {
            value : row._id,
            name : row.supplierName
          }));
        });
        cb();
      });
    },
    function(cb){
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
        cb();
      });
    },
    function(cb){
      smart.doget("/unit/list?limit=" + Number.MAX_VALUE, function (err, result) {
        var list = result.items;
        var tmpl = $('#tmpl_option').html();
        var container = $("#unit_list");
        _.each(list, function(row){

          container.append(_.template(tmpl, {
            value : row._id,
            name : row.unitName
          }));
        });
        cb();
      });
    },
    function(cb){
      smart.doget("/room/list?limit=" + Number.MAX_VALUE, function (err, result) {
        var list = result.items;
        var tmpl = $('#tmpl_option').html();
        var container = $("#room_list");
        _.each(list, function(row){

          container.append(_.template(tmpl, {
            value : row._id,
            name : row.roomName
          }));
        });
        cb();
      });
    },
  ], function(){

    var productId = $("#productId").val();

    if (productId) {

      $("#addBtn").html("修改");
      $("#addAndNextBtn").hide();

      smart.doget("/api/product/get.json?productId=" + productId, function (err, result) {

        $("#productName").val(result.productName);
        $("#productSN").val(result.productSN);
        $("#productCode").val(result.productCode);
        $("#productPrice").val(result.productPrice);
        $("#productDescription").val(result.productDescription);

        $("#unit_list").val(result.unitId);
        $("#room_list").val(result.roomId);
        $("#supplier_list").val(result.supplierId);
        $("#category_list").val(result.categoryId);

      });
    }
  });
};