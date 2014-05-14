var datastore = {
  schema: "",
  options: {
    url: ""
  },
  grid: {
    table: "",
    tbody: "",
    store: {
      url: ""
    },
    render: function(){
      datastore.request.doGet({

      },function(){

      },function(){

      });
    }
  },
  window: {

  },
  alert: {

  },
  setSchema: function (schema) {
    this.schema = schema;
  },
  request: {
    doPost: function (opt, success, error) {

    },
    doGet: function (opt, success, error) {

    }
  }

}
