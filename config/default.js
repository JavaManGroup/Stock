module.exports = {
  "db": {
//      "host": "219.127.220.106"
    "host": "115.28.210.254"
    , "port": 27017
    , "dbname": "diandian"
    , "prefix": ""
    , "schema": {
      "User": "Users"
    }
    , "pool": 5
  },

  "testdb": {
    "host": "mongo"
    , "port": 27017
    , "dbname": "developer"
    , "pool": 5
  },

  "mail": {
    "service": "Gmail"
    , "auth": {
      "user": "smart@gmail.com"
      , "pass": "smart"
    }
  },

  "app": {
    "port": 3000
    , "views": "views"
    , "public": "/public"
    , "static": "/static"
    , "cookieSecret": "smartcore"
    , "sessionSecret": "smartcore"
    , "sessionKey": "smartcore.sid"
    , "sessionTimeout": 48 // 24 * 2 两天
    , "tmp": "/tmp"
    , "hmackey": "smartcore"
    , "i18n": {
        "cache": "memory"
      , "lang": "ja"
      , "category": "yukari"
    }
    , "ignoreAuth": [
      // 静态资源
        "^\/stylesheets"
      , "^\/javascripts"
      , "^\/vendor"
      , "^\/images"
      , "^\/video"

      // 登陆，注册相关
      , "^\/$"
      , "^\/simplelogin.*"
      , "^\/simplelogout.*"
      , "^\/login.*"
      , "^\/storeLogin.*"
      , "^\/StoreLogin.*"
      , "^\/register.*"
      , "^\/CSRFToken.*"
      , "^\/device\/register.*"
      , "^\/download.*"
      , "^\/picture*"
    ]
    , "i18n": {
      "cache": "memory"
        , "directory": {
          "yukari": "/locales"
        }
      , "lang": "ja"
    }
  },

  "log": {
    "fluent": {
      "enable": "yes"
      , "tag": "node"
      , "host": "10.2.8.228"
      , "port": 24224
      , "timeout": 3.0
    }
    , "console": "true"
  },

  "mq": {
    "host": "mq"
    , "port": 5672
    , "user": "guest"
    , "password": "guest"
    , "queue_join": "smartJoin"
    , "queue_apn": "smartApn"
    , "queue_thumb": "smartPhoto"
    , "maxListeners": 0
  },

  "apn": {
    "enabled"   : true
    , "mode"    : "product"  // product: Production mode      dev: Development mode
    , "dev"     : {
      "cert"        : "config/apn/dev_cert.pem" // First use env.APN_CERT_FILE
      , "key"       : "config/apn/dev_key.pem"  // First use env.APN_KEY_FILE
      , "port"      : ""  // Default port is 2195
      , "maxConnections"    : 1
      , "connectionTimeout" : 0 // 0 = Disabled
    }
    , "product" : {
      "cert"        : "config/apn/pro_cert.pem" // First use env.APN_CERT_FILE
      , "key"       : "config/apn/pro_key.pem"  // First use env.APN_KEY_FILE
      , "port"      : ""  // Default port is 2195
      , "maxConnections"    : 1
      , "connectionTimeout" : 0 // 0 = Disabled
    }
  }
}
