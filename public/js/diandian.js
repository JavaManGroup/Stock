// namespace
var smart = {


  init: function() {
    _.templateSettings = {
      interpolate : /\{\{-(.+?)\}\}/gim,
      evaluate: /\<\$(.+?)\$\>/gim,
      escape: /\{\{([^-]+?)\}\}/gim
    };
  }(),

  /**
   * 翻页
   */
  paginationInitalized: false,
  paginationScrollTop : true,
  pagination: function(container, totalItems, rowCount, callback) {

    // 初始化一次
    if (this.paginationInitalized) {
      return;
    }
    this.paginationInitalized = true;

    var startPage = 1, pageCount = 5
      , limit = Math.ceil(totalItems / rowCount) > pageCount ? pageCount : Math.ceil(totalItems / rowCount)
      , tmpl = $("#tmpl_pagination").html();

    container.unbind("click").on("click", "a", function(event){

      var activePage = $(event.target).attr("activePage");

      if (activePage == "prev") {
        if(startPage == 1){
          return false;
        }else{
          startPage = activePage = startPage - pageCount < 1 ? 1 : startPage - pageCount;
        }
      } else if (activePage == "next") {
        if(Math.ceil((totalItems - (startPage - 1) * rowCount) / rowCount) > pageCount ){
          startPage = activePage = startPage + pageCount;
        }
        else{
          return false;
        }
      }
      callback((activePage - 1) * rowCount);

      var remainder = Math.ceil((totalItems - (startPage - 1) * rowCount) / rowCount)
        , limit = remainder > pageCount ? pageCount : remainder;
      container.html("");
      container.append(_.template(tmpl, {
        "start": startPage
        , "limit": limit
        , "active": activePage
        , "canPrev": startPage > 1
        , "canNext": (startPage+limit-1 < Math.ceil(totalItems / rowCount)) && (limit >= pageCount)
      }));
      if (smart.paginationScrollTop) {
        return ;
      } else {

        return false;
      }

    });

    // 初始化
    container.html("");
    container.append(_.template(tmpl, {
      "start": 1, "limit": limit, "active": 1, "canPrev": false, "canNext": limit < Math.ceil(totalItems / rowCount) && (limit >= pageCount)
    }));
  },

  error: function(err,defaultMsg,moveToErrPage){
    if(err){
      $.smallBox({
        title : "提示",
        content : defaultMsg,
        color : "#a90329",
        iconSmall : "fa fa-bullhorn",
        timeout : 2000
      });
      return true;
    } else {
      return false;
    }
  },
  date: function(date, format, withTimezone) {
    if(typeof(date) != "string" || date == "")
      return "";
    format = format || "yyyy/MM/dd hh:mm";
    withTimezone = (withTimezone == true)? true: false;

    var timezone = $("#timezone").val();
    var time = Date.parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    time += new Date().getTimezoneOffset() * 60 * 1000;
    time += timezone.substring(3,6) * 3600 * 1000;

    if(withTimezone) { // 2013/04/18 08:00(+0800)
      return new Date(time).Format(format) + "(" + timezone.substring(3,9) + ")";
    } else { // 2013/04/18 08:00
      return new Date(time).Format(format);
    }
    //return new Date(time).toLocaleString() + $.datepicker.formatDate('yy/mm/dd h:mm', new Date(time))
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
  },
  doput: function(url_, obj_, callback_) {
    obj_["uid"] = this.uid();
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf()
      , type: "PUT"
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
  },
  dodelete: function(url_, obj_, callback_) {
    obj_["uid"] = this.uid();
    var self = this;
    $.ajax({
      url: url_ + "?_csrf=" + self.csrf()
      , type: "DELETE"
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



Date.prototype.pattern=function(fmt) {

  var o = {
    "M+" : this.getMonth()+1, //月份
    "d+" : this.getDate(), //日
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
    "H+" : this.getHours(), //小时
    "m+" : this.getMinutes(), //分
    "s+" : this.getSeconds(), //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S" : this.getMilliseconds() //毫秒
  };

  var week = {
    "0" : "\u65e5",
    "1" : "\u4e00",
    "2" : "\u4e8c",
    "3" : "\u4e09",
    "4" : "\u56db",
    "5" : "\u4e94",
    "6" : "\u516d"
  };

  if(/(y+)/.test(fmt)){

    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  if(/(E+)/.test(fmt)){

    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);
  }
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}