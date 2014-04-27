// namespace
var smart = {


  init: function() {
    _.templateSettings = {
      interpolate : /\{\{-(.+?)\}\}/gim,
      evaluate: /\<\$(.+?)\$\>/gim,
      escape: /\{\{([^-]+?)\}\}/gim
    };
  }(),
  error: function(err,defaultMsg,moveToErrPage){
    if(err){
      if(err.status == 403 || err.status == 400 || err.status == 500){
        if(moveToErrPage){
          window.location = "/error/"+err.status;
          return true;
        }
      }

      if(err.responseJSON && err.responseJSON.error && err.responseJSON.error.message){
        Alertify.log.error(err.responseJSON.error.message);
      } else {
        Alertify.log.error(defaultMsg);
        console.log(err);
      }
      return true;
    } else {
      return false;
    }
  },

  csrf: function() {
    return encodeURIComponent($("#_csrf").val());
  },
  uid: function() {
    return $("#userid").val();
  },
  doget: function (url_, callback_) {
    $.ajax({
      type: "GET", url: url_, dataType: "json", success: function (result) {
        callback_(result.error, result.data);
      }, error: function (err) {
        callback_(err);
      }
    });
  },
  dopost: function(url_, obj_, callback_) {
    obj_["uid"] = this.uid();
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf()
      , type: "POST"
      , async: false
      , data: JSON.stringify(obj_)
      , dataType: "json"
      , contentType: "application/json"
      , processData: false
      , success: function(result) {
        if (result.error) {
          callback_(1, result.error);
        } else {
          callback_(0, result);
        }
      }
      , error: function(err) {
        console.log("do ajax " + url_ + "   error");
        callback_(err);
      }
    });
  }
}
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
    
  if (/(y+)/.test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) 
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  
  return fmt;
};

/**
 * 代替Radio的按钮组合
 * @param id 字符串
 * @param value
 * @constructor
 */
var ButtonGroup = function(id, value, clickCallback) {
  this.id = $("#" + id);
  this.value = value;

  // append event
  var self = this;
  this.id.on("click", "button", function(){
    self.value = $(this).attr("value");
    self.init();

    if (clickCallback) {
      clickCallback(this.value);
    }
  });
};

ButtonGroup.prototype.init = function(initCallback) {

  // set default value
  this.id.attr("value", this.value);

  var child = this.id.children()
    , self = this;

  _.each(child, function(item){
    if (self.value == $(item).attr("value")) {
      $(item).addClass("btn-info");
      $(item).removeClass("btn-white");
      $(item).attr("active", "on");
    } else {
      $(item).removeClass("btn-info");
      $(item).addClass("btn-white");
      $(item).removeAttr("active");
    }
  });

  if (initCallback) {
    initCallback(self.value);
  }
};

ButtonGroup.prototype.set = function(value) {
  this.value = value;
  this.init();
};