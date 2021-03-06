# node http(s) server graceful shutdown

[![Build Status](https://travis-ci.org/josiasmontag/node-server-graceful-shutdown.svg?branch=master)](https://travis-ci.org/josiasmontag/node-server-graceful-shutdown)

Adds a ``shutdown(callback)`` to nodes http(s) servers. ``shutdown()`` will stop accepting new connections and waits until all pending requests are finished.

This is very similar to the node builtin [close()](https://nodejs.org/api/net.html#net_server_close_callback) function with the only difference that ``shutdown()`` destroys idle connections (keep alive connections). This is done using [socket.setTimeout()](https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback), which destroys sockets after some time without data transfer (10 seconds as default).

## Usage

```javascript
var enableGracefulShutdown = require('server-graceful-shutdown');

var server = http.createServer(function(req, res) {
  // do stuff
});

server.listen(80);

// enhance server with a 'shutdown' function
enableGracefulShutdown(server);
// you can set the socket idle timeout using the second parameter 
// e.g. enableGracefulShutdown(server, 5000);

// some time later...
server.shutdown(function() {
	// all requests are finished 
	// we can 
	// process.exit() 
	// now
});
```