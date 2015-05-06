var serverEnableGracefulShutdown = require('./index.js');
var http = require('http');
var assert = require('assert');




var serverclosed = false;
var server = http.createServer(function (req, res) {
  console.log('server: request incoming');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  // we send data every second for a span of 10s
  var i = 0;
  var intervalResponse = setInterval(function() {
  	if(i < 10) {
  		res.write("hello " + i);
  		console.log('server: sent data to client');
  		i++;
  	} else {
  		clearInterval( intervalResponse );
  	}
  }, 1000);

  
  // we gracefully shutdown the server
  console.log('server: graceful server shutdown initiated');
  server.shutdown(function() {
	serverclosed = true;
	console.log('server: graceful server shutdown complete');
  });


}).listen(1337, '127.0.0.1');
serverEnableGracefulShutdown(server, 5000);
console.log('server running at http://127.0.0.1:1337/');




http.get("http://127.0.0.1:1337/", function(response) {

	response.on("data", function() {
		console.log("client: got data");
	});

	response.on("end", function() {
		console.log("client: response end");
	});

	setTimeout(function() {
		if(serverclosed)
			assert(false, "Server closed after 5s but there were still active requests.")
	}, 8000);


	setTimeout(function() {
		if(serverclosed) {
			console.log("all ok");
			assert(true, "Server closed correctly after all requests were finished.")
		} else {
			assert(false, "Server did not close after 18s but it should close after ~15s (10s response time + 5s socketIdleTimeout)")
		}
	}, 18000);



});

