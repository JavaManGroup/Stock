var zookeeper = require('node-zookeeper-client');

var client = zookeeper.createClient('115.29.45.97:2181');
var client1 = zookeeper.createClient('115.29.45.97:2181');

var path = "/test";

var i = 0;

function doAction(){
  console.log("do action " + i++);
}

function getLock(data, callback ) {

  function getData(client, path) {
    client.getData(
      path,
      function (event) {
        console.log('Got event: %s', event);
        getData(client, path);
      },
      function (error, data, stat) {

        if (error) {
          console.log('Error occurred when getting data: %s.', error);
          return;
        }

        console.log(
          'Node: %s has data: %s, version: %d',
          path,
          data ? data.toString() : undefined,
          stat.version
        );

        if(data.toString() == '2') {
          doAction();
        } else {

          setTimeout(function(){
            callback();
          },5000);
        }
        client.close();
      }
    );
  }

  client.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    getData(client, path);
  });

  client.connect();
}

function waitForLock() {


  client1.once('connected', function () {
    console.log('Connected to ZooKeeper.');
    exists(client1, path);
  });


  function exists(client1, path) {
    client1.exists(
      path,
      function (event) {
        console.log('Got event: %s.', event);
        exists(client1, path);
      },
      function (error, stat) {
        if (error) {
          console.log(
            'Failed to check existence of node: %s due to: %s.',
            path,
            error
          );
          return;
        }

        if (stat) {
          console.log(
            'Node: %s exists and its version is: %j',
            path,
            stat.version
          );
          setTimeout(function(){
            getLock("1" ,function(){
              waitForLock();
            });
          },5000);
        } else {

          console.log('Node %s does not exist.', path);
        }
      }
    );
  }



  client1.connect();
}

waitForLock();
